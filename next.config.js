/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Uploads can live on any host (R2 public URL, ImageKit, Google avatars),
    // so do not depend on an env var being set at build time.
    remotePatterns: [{ protocol: "https", hostname: "**" }],
    domains: [
      "ik.imagekit.io",
      ...(process.env.R2_PUBLIC_HOST ? [process.env.R2_PUBLIC_HOST] : []),
      "adbacklist.s3.ap-southeast-1.amazonaws.com",
      "dk3vy6fruyw6l.cloudfront.net",
      "lh3.googleusercontent.com",
    ],
  },
  reactStrictMode: true,
  swcMinify: true,
};

module.exports = nextConfig;
