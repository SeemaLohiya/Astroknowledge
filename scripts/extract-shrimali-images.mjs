import fs from "fs";

const html = fs.readFileSync("data/shrimali-products.html", "utf8");

// Extract product-like JSON fragments
const products = [];
for (const m of html.matchAll(/"slug":"([^"]+)","name":"([^"]+)","price":(\d+)[^}]*?"image":"([^"]+)"/g)) {
  products.push({ slug: m[1], name: m[2], price: Number(m[3]), image: m[4] });
}

// Fallback: name near image within 400 chars
if (products.length < 10) {
  for (const m of html.matchAll(/"name":"([^"]{5,120})"[\s\S]{0,500}?"image":"(\/images\/products\/[^"]+)"/g)) {
    products.push({ name: m[1], image: m[2] });
  }
}

const seen = new Set();
const unique = products.filter((p) => {
  const k = p.image;
  if (seen.has(k)) return false;
  seen.add(k);
  return true;
});

console.log(JSON.stringify(unique.slice(0, 40), null, 2));
console.error("Total unique:", unique.length);
