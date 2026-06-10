import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.join(__dirname, "..");
const outDir = path.join(root, "public/images/products");
const base = "https://www.panditnmshrimali.com";

/** Our product id -> Shrimali image path (from panditnmshrimali.com/products) */
const STATIC_MAP = {
  p1: "/images/products/rudraksha/5-mukhi-indo-1.png",
  p2: "/images/products/rudraksha/7-mukhi-nepali-1.png",
  p3: "/images/products/parad/parad-shivling-1.png",
  p4: "/images/products/pendant/guru-yantra/1.jpg",
  p5: "/images/products/pendant/shani-yantra/1.jpg",
  p6: "/images/products/pendant/shree-yantra/1.jpg",
  p7: "/images/products/pendant/mahamritunjay-yantra/1.jpg",
  p8: "/images/products/parad/parad-lakshmi-ganesh-1.png",
  p9: "/images/products/mala-bracelet/sphatik-mala/2.png",
  p10: "/images/products/parad/parad-swastik-1.png",
  p11: "/images/products/pendant/shree-yantra/2.png",
  p12: "/images/products/mala-bracelet/sphatik-mala/1.png",
  p13: "/images/products/mala-bracelet/7-chakra-mala/2.png",
  p14: "/images/products/parad/parad-laxmi-1.png",
  p15: "/images/products/parad/parad-panchmukhi-hanuman-1.png",
  p16: "/images/products/parad/parad-lakshmi-ganesh-2.png",
  p17: "/images/products/pendant/surya-yantra/2.png",
  p18: "/images/products/pendant/budh-yantra/1.jpg",
  p19: "/images/products/rudraksha/1-mukhi-indo-1.png",
  p20: "/images/products/mala-bracelet/7-chakra-mala/1.png",
};

async function download(url, dest) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`${res.status} ${url}`);
  fs.writeFileSync(dest, Buffer.from(await res.arrayBuffer()));
}

const imagePaths = {};
for (const [id, imagePath] of Object.entries(STATIC_MAP)) {
  const ext = path.extname(imagePath);
  const dest = path.join(outDir, `${id}${ext}`);
  const url = `${base}/_next/image?url=${encodeURIComponent(imagePath)}&w=640&q=80`;
  try {
    await download(url, dest);
    imagePaths[id] = `/images/products/${id}${ext}`;
    console.log(`OK ${id}${ext}`);
  } catch {
    try {
      await download(`${base}${imagePath}`, dest);
      imagePaths[id] = `/images/products/${id}${ext}`;
      console.log(`OK direct ${id}${ext}`);
    } catch (e) {
      console.error(`FAIL ${id}:`, e.message);
    }
  }
}

fs.writeFileSync(path.join(root, "data/shrimali-product-map.json"), JSON.stringify(imagePaths, null, 2));
