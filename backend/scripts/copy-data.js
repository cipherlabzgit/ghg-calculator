const fs = require("fs");
const path = require("path");

const REQUIRED_FILES = [
  "countries.json",
  "emission-factors.json",
  "factor-trees.json",
  "food-factors.json",
  "home-office.json",
];

const srcDir = path.join(__dirname, "..", "src", "data");
const destDir = path.join(__dirname, "..", "dist", "data");

fs.mkdirSync(destDir, { recursive: true });

for (const filename of REQUIRED_FILES) {
  const from = path.join(srcDir, filename);
  if (!fs.existsSync(from)) {
    throw new Error(`Missing required dataset: ${from}`);
  }
  fs.copyFileSync(from, path.join(destDir, filename));
}

console.log(`Copied ${REQUIRED_FILES.length} JSON datasets to ${destDir}`);
