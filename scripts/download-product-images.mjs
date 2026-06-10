import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const BASE = "https://www.panditnmshrimali.com";
const OUT = path.join(path.dirname(fileURLToPath(import.meta.url)), "..", "public", "images", "products", "ref");

const MAP = {
  p1: "/images/products/5-mukhi-rudraksha_1.webp",
  p2: "/images/products/rudraksha/7-mukhi-indo-1.png",
  p3: "/images/products/parad/parad-shivling-1.png",
  p4: "/images/products/pendant/guru-yantra/1.jpg",
  p5: "/images/products/pendant/shani-yantra/1.jpg",
  p6: "/images/products/pendant/shree-yantra/1.jpg",
  p7: "/images/products/pendant/mahamritunjay-yantra/1.jpg",
  p8: "/images/products/parad/parad-lakshmi-ganesh-1.png",
  p9: "/images/products/mala-bracelet/7-chakra-mala/1.png",
  p10: "/images/products/parad/parad-swastik-1.png",
  p11: "/images/products/rudraksha/gauri-shankar-indo-1.png",
  p12: "/images/products/mala-bracelet/sphatik-mala/1.png",
  p13: "/images/products/mala-bracelet/sphatik-mala/2.png",
  p14: "/images/products/parad/parad-laxmi-1.png",
  p15: "/images/products/pendant/ram-raksha-yantra/1.jpg",
  p16: "/images/products/parad/parad-panchmukhi-hanuman-1.png",
  p17: "/images/products/pendant/surya-yantra/2.png",
  p18: "/images/products/pendant/budh-yantra/1.jpg",
  p19: "/images/products/rudraksha/1-mukhi-nepali-1.png",
  p20: "/images/products/mala-bracelet/7-chakra-mala/2.png",
};

fs.mkdirSync(OUT, { recursive: true });

for (const [id, remotePath] of Object.entries(MAP)) {
  const ext = path.extname(remotePath) || ".jpg";
  const outFile = path.join(OUT, `${id}${ext}`);
  const url = `${BASE}${remotePath}`;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(outFile, buf);
    console.log(`OK ${id} <- ${remotePath}`);
  } catch (e) {
    console.error(`FAIL ${id}: ${e.message}`);
  }
}
