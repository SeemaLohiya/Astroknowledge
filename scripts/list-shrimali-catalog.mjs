import fs from "fs";

const html = fs.readFileSync("data/shrimali-products.html", "utf8");
const paths = [...new Set([...html.matchAll(/\/images\/products\/[a-z0-9\-\/]+\.(png|jpg|jpeg|webp)/gi)].map((m) => m[0]))];
console.log("paths", paths.length);
paths.forEach((p) => console.log(p));

const alts = [...new Set([...html.matchAll(/alt="([^"]{8,100})"/g)].map((m) => m[1]))].filter(
  (a) => !a.includes("Pandit") && !a.includes("Shrimali") && a !== "Open menu"
);
console.log("\nalts", alts.length);
alts.slice(0, 80).forEach((a) => console.log(a));
