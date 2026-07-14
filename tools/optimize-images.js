// One-time import: convert rescued Google Sites photos to bounded WebP.
// Source: .firecrawl/images (raw downloads) -> src/assets/images/*.webp
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SRC = path.join(__dirname, "..", ".firecrawl", "images");
const OUT = path.join(__dirname, "..", "src", "assets", "images");
fs.mkdirSync(OUT, { recursive: true });

(async () => {
  const files = fs.readdirSync(SRC).filter((f) => /\.(jpe?g|png|webp)$/i.test(f));
  let total = 0;
  for (const f of files) {
    const name = f.replace(/\.(jpe?g|png|webp)$/i, "") + ".webp";
    const dest = path.join(OUT, name);
    if (fs.existsSync(dest)) continue;
    await sharp(path.join(SRC, f))
      .rotate() // respect EXIF orientation
      .resize({ width: 1600, height: 1600, fit: "inside", withoutEnlargement: true })
      .webp({ quality: 85 })
      .toFile(dest);
    total++;
  }
  const sizes = fs.readdirSync(OUT).reduce((a, f) => a + fs.statSync(path.join(OUT, f)).size, 0);
  console.log(`converted ${total} images, output total ${(sizes / 1024 / 1024).toFixed(1)} MB`);
})();
