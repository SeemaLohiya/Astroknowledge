import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(path.dirname(fileURLToPath(import.meta.url)));
const catalogPath = path.join(root, "data/catalog.json");
const map = JSON.parse(fs.readFileSync(path.join(root, "data/shrimali-product-map.json"), "utf8"));

const catalog = JSON.parse(fs.readFileSync(catalogPath, "utf8"));
for (const product of catalog.products) {
  if (map[product.id]) product.image = map[product.id];
}
fs.writeFileSync(catalogPath, JSON.stringify(catalog, null, 2));
console.log("Updated", catalog.products.length, "product images in catalog.json");
