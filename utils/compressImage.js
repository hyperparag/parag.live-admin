/**
 * Client-side image compression.
 *
 * Every upload form used to simply reject anything over its size limit, so a
 * user with a 5MB phone photo had to go and shrink it themselves. This resizes
 * and re-encodes in the browser instead, looping on quality and then on
 * resolution until the file fits, so a photo of any size can be posted as-is.
 *
 * Canvas only -- no extra dependency.
 */

const DEFAULTS = {
  /** Hard ceiling for the produced file. */
  maxBytes: 50 * 1024,
  /** Longest edge of the output, before the loop starts shrinking further. */
  maxDimension: 1600,
  /** Never shrink below this, even if the target size is unreachable. */
  minDimension: 400,
  startQuality: 0.82,
  minQuality: 0.4,
  /** Safety valve so a pathological image can never loop forever. */
  maxIterations: 24,
  mimeType: "image/jpeg",
};

/** Decode a File into something canvas can draw. */
async function decode(file) {
  if (typeof createImageBitmap === "function") {
    try {
      return await createImageBitmap(file);
    } catch (error) {
      // Safari and HEIC both land here; fall through to the <img> path.
    }
  }

  const url = URL.createObjectURL(file);
  try {
    return await new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error("The browser could not read this image."));
      img.src = url;
    });
  } finally {
    // Revoking immediately is safe: the decoded image is already in memory.
    URL.revokeObjectURL(url);
  }
}

function toBlob(canvas, mimeType, quality) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("Encoding failed."))),
      mimeType,
      quality
    );
  });
}

function draw(source, width, height) {
  const canvas = document.createElement("canvas");
  canvas.width = Math.max(1, Math.round(width));
  canvas.height = Math.max(1, Math.round(height));

  const ctx = canvas.getContext("2d");
  // JPEG has no alpha channel, so a transparent PNG would come out with a black
  // background without this fill.
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";
  ctx.drawImage(source, 0, 0, canvas.width, canvas.height);

  return canvas;
}

function renameToJpg(name) {
  const base = (name || "image").replace(/\.[^.]+$/, "");
  return `${base}.jpg`;
}

/**
 * Compress one File down to options.maxBytes or as close as the limits allow.
 *
 * Returns the original File untouched when it is already small enough, or when
 * the browser cannot decode it (iPhone HEIC is the common case) -- callers get a
 * `skipped` reason they can surface rather than silently losing the photo.
 *
 * @returns {Promise<{file: File, originalSize: number, size: number, compressed: boolean, skipped?: string, width?: number, height?: number}>}
 */
export async function compressImage(file, options = {}) {
  const opts = { ...DEFAULTS, ...options };

  if (!file || typeof file !== "object") {
    return { file, originalSize: 0, size: 0, compressed: false, skipped: "not-a-file" };
  }

  if (!String(file.type || "").startsWith("image/")) {
    return {
      file,
      originalSize: file.size,
      size: file.size,
      compressed: false,
      skipped: "not-an-image",
    };
  }

  let source;
  try {
    source = await decode(file);
  } catch (error) {
    return {
      file,
      originalSize: file.size,
      size: file.size,
      compressed: false,
      skipped: "undecodable",
    };
  }

  const naturalWidth = source.width || source.naturalWidth;
  const naturalHeight = source.height || source.naturalHeight;

  if (!naturalWidth || !naturalHeight) {
    return {
      file,
      originalSize: file.size,
      size: file.size,
      compressed: false,
      skipped: "undecodable",
    };
  }

  // Already small enough and not oversized: leave it exactly as it is.
  const longestEdge = Math.max(naturalWidth, naturalHeight);
  if (file.size <= opts.maxBytes && longestEdge <= opts.maxDimension) {
    if (source.close) source.close();
    return {
      file,
      originalSize: file.size,
      size: file.size,
      compressed: false,
      width: naturalWidth,
      height: naturalHeight,
    };
  }

  // Start by fitting inside maxDimension, keeping the aspect ratio.
  const initialScale = Math.min(1, opts.maxDimension / longestEdge);
  let width = naturalWidth * initialScale;
  let height = naturalHeight * initialScale;
  let quality = opts.startQuality;

  let canvas = draw(source, width, height);
  let blob = await toBlob(canvas, opts.mimeType, quality);
  let best = blob;

  let iterations = 0;
  while (blob.size > opts.maxBytes && iterations < opts.maxIterations) {
    iterations += 1;

    if (quality > opts.minQuality) {
      // Cheapest lever first: drop quality without touching resolution.
      quality = Math.max(opts.minQuality, Math.round((quality - 0.12) * 100) / 100);
      blob = await toBlob(canvas, opts.mimeType, quality);
    } else if (Math.max(width, height) > opts.minDimension) {
      // Quality is as low as we will go, so shrink the image instead.
      //
      // JPEG size tracks pixel count, so scaling by 1/sqrt(overshoot) aims
      // straight at the target rather than creeping down by a fixed step. A
      // fixed 0.85 step needed a dozen or more re-encodes on a phone photo and
      // ran out of iterations before it ever got under the limit.
      const overshoot = blob.size / opts.maxBytes;
      const scale = Math.min(0.9, 0.95 / Math.sqrt(overshoot));

      const nextLongest = Math.max(width, height) * scale;
      if (nextLongest < opts.minDimension) {
        // Clamp to the floor, try once there, then stop.
        const floorScale = opts.minDimension / Math.max(width, height);
        width *= floorScale;
        height *= floorScale;
      } else {
        width *= scale;
        height *= scale;
      }

      // Give a little quality back, since resolution is now doing the work.
      quality = 0.7;
      canvas = draw(source, width, height);
      blob = await toBlob(canvas, opts.mimeType, quality);
    } else {
      // Both levers exhausted; keep the smallest result we managed.
      break;
    }

    if (blob.size < best.size) best = blob;
  }

  if (source.close) source.close();

  const chosen = blob.size <= best.size ? blob : best;

  // If re-encoding somehow made things worse, keep the original.
  if (chosen.size >= file.size) {
    return {
      file,
      originalSize: file.size,
      size: file.size,
      compressed: false,
      skipped: "no-gain",
      width: naturalWidth,
      height: naturalHeight,
    };
  }

  const out = new File([chosen], renameToJpg(file.name), {
    type: opts.mimeType,
    lastModified: Date.now(),
  });

  return {
    file: out,
    originalSize: file.size,
    size: out.size,
    compressed: true,
    width: Math.round(width),
    height: Math.round(height),
  };
}

/** Compress a list of files, in order. */
export async function compressImages(files, options = {}) {
  const results = [];
  for (const file of Array.from(files || [])) {
    results.push(await compressImage(file, options));
  }
  return results;
}

/** "2.4 MB" / "48 KB" -- for telling the user what happened. */
export function formatBytes(bytes) {
  const n = Number(bytes) || 0;
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${Math.round(n / 1024)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}

export default compressImage;
