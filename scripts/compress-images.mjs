import sharp from "sharp";
import fs from "fs";
import path from "path";

const PUBLIC = path.join(process.cwd(), "public");

function walk(dir, files = []) {
  if (!fs.existsSync(dir)) return files;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full, files);
    else files.push(full);
  }
  return files;
}

async function compress(file) {
  const ext = path.extname(file).toLowerCase();
  if (![".png", ".jpg", ".jpeg"].includes(ext)) return null;

  const before = fs.statSync(file).size;
  const tmp = file + ".tmp";
  const img = sharp(file);
  const meta = await img.metadata();

  const isRef = file.includes("ref" + path.sep);
  const isAchievement = file.includes("achievements" + path.sep);
  const isLogo = file.includes("logo.png") || file.includes("seema-lohiya");
  const maxW = isRef ? 640 : isAchievement || isLogo ? 800 : 1200;

  if (ext === ".png") {
    await sharp(file)
      .resize(maxW, maxW, { fit: "inside", withoutEnlargement: true })
      .png({ quality: 72, compressionLevel: 9, palette: true, colors: 128 })
      .toFile(tmp);
  } else {
    await sharp(file)
      .resize(maxW, maxW, { fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true })
      .toFile(tmp);
  }

  fs.renameSync(tmp, file);
  const after = fs.statSync(file).size;
  return { file: path.relative(PUBLIC, file), before, after, w: meta.width, h: meta.height };
}

const imagesDir = path.join(PUBLIC, "images");
const files = walk(imagesDir);
let saved = 0;
let count = 0;

console.log(`Compressing ${files.length} images...`);

for (const file of files) {
  try {
    const result = await compress(file);
    if (result) {
      saved += result.before - result.after;
      count++;
      if (result.before > 150_000) {
        console.log(`  ${result.file}: ${(result.before / 1024).toFixed(0)}KB → ${(result.after / 1024).toFixed(0)}KB`);
      }
    }
  } catch (e) {
    console.error(`  Failed: ${file}`, e.message);
  }
}

console.log(`Done. ${count} images compressed, saved ${(saved / 1024 / 1024).toFixed(2)} MB`);
