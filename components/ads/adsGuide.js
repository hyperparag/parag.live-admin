import React from "react";

// One entry per kind of ad the site can show. `tab` is the admin menu key that
// manages it, so the cards double as shortcuts.
const AD_TYPES = [
  {
    tab: "links",
    name: "Header Ads",
    kind: "Text links",
    where:
      "The bar of three links at the very top of every city / category listing page (above the posts).",
    fields: "Three links: Shemale Escorts, Meet, Live. Paste a full URL in each box.",
    size: "No image. Leave a box blank to keep its current link.",
  },
  {
    tab: "sideLinks",
    name: "Side Ads",
    kind: "Banner image + link",
    where:
      "The \"Sponsored\" grid on listing pages and beside blog articles. Each ad is shown for the category you choose, so a Dating ad only appears with Dating content.",
    fields:
      "Image, Title, Link and Category. Add as many as you like; if a category has none, ads from other categories fill in.",
    size: "Square or 4:3 image works best (about 600 x 450). It is shrunk to 50KB automatically.",
  },
  {
    tab: "responsive",
    name: "Responsive Ad",
    kind: "One wide banner + link",
    where:
      "A single full-width banner under the header links on listing pages. It scales down on phones.",
    fields: "One image and one Link. Updating it replaces the previous banner.",
    size: "Wide banner, about 1200 x 300 (4:1).",
  },
  {
    tab: "rainbow",
    name: "Rainbow Ad",
    kind: "Colourful text line + link",
    where:
      "The animated rainbow text line on an individual post's detail page.",
    fields: "One line of Text and one Link. Updating it replaces the previous line.",
    size: "No image. Keep the text short (a few words).",
  },
];

const AdsGuide = ({ onOpen }) => (
  <div>
    <p className='text-black mb-4'>
      These are all the places an advertisement can appear on the site. Open
      any card to add or change its links. Nothing is shown to visitors until
      you add content to it.
    </p>
    <div className='grid gap-4 md:grid-cols-2'>
      {AD_TYPES.map((ad) => (
        <div
          key={ad.tab}
          className='border border-gray-300 rounded-lg p-4 bg-white text-black flex flex-col'
        >
          <div className='flex items-center justify-between mb-2'>
            <h2 className='text-lg font-bold'>{ad.name}</h2>
            <span className='text-xs px-2 py-1 rounded bg-gray-200'>
              {ad.kind}
            </span>
          </div>
          <p className='text-sm mb-2'>
            <b>Where it shows:</b> {ad.where}
          </p>
          <p className='text-sm mb-2'>
            <b>What to enter:</b> {ad.fields}
          </p>
          <p className='text-sm mb-4'>
            <b>Image / size:</b> {ad.size}
          </p>
          <button
            className='mt-auto self-start bg-black text-white px-4 py-1 rounded font-semibold'
            onClick={() => onOpen(ad.tab)}
          >
            Open {ad.name}
          </button>
        </div>
      ))}
    </div>
  </div>
);

export default AdsGuide;
