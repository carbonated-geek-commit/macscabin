// Scratch tool: contact sheet of images matching a prefix, labeled with index+name.
const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const prefix = process.argv[2] || "local-attractions--";
const out = process.argv[3] || "contact-sheet.png";
const SRC = path.join(__dirname, "..", "src", "assets", "images");

(async () => {
  const files = fs.readdirSync(SRC).filter((f) => f.startsWith(prefix)).sort();
  const TW = 240, TH = 200, LABEL = 36, COLS = 5;
  const rows = Math.ceil(files.length / COLS);
  const composites = [];
  for (let i = 0; i < files.length; i++) {
    const x = (i % COLS) * TW, y = Math.floor(i / COLS) * (TH + LABEL);
    const buf = await sharp(path.join(SRC, files[i]))
      .resize(TW, TH, { fit: "cover" }).png().toBuffer();
    composites.push({ input: buf, left: x, top: y });
    const label = files[i].replace(prefix, "").replace(".webp", "").slice(0, 38);
    const svg = Buffer.from(
      `<svg width="${TW}" height="${LABEL}"><rect width="100%" height="100%" fill="white"/><text x="4" y="14" font-size="11" font-family="sans-serif">${i}: ${label.slice(0, 24)}</text><text x="4" y="28" font-size="11" font-family="sans-serif">${label.slice(24)}</text></svg>`
    );
    composites.push({ input: svg, left: x, top: y + TH });
  }
  await sharp({
    create: { width: COLS * TW, height: rows * (TH + LABEL), channels: 3, background: "white" },
  }).composite(composites).png().toFile(out);
  console.log(out, files.length, "images");
})();
