/**
 * Downloads 8 civic infrastructure images from Unsplash into public/civic-images/.
 * Order: sanitation → water → electrical → roads → traffic → health → parks → housing
 * Uses Sharp for compression if available. Run: node scripts/download-civic-images.js
 */

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT_DIR = path.join(__dirname, '..', 'public', 'civic-images');
const WIDTH = 1920;
const QUALITY = 85;

// Unsplash image IDs (photo-{id1}-{id2}) for each category
const IMAGES = [
  { name: 'sanitation', id: '1604187351574-c75ca79f5807' },   // garbage truck / cleaning
  { name: 'water', id: '1548839140-29a749e1cf4d' },           // water / pipeline
  { name: 'electrical', id: '1514565131-fce0801e5785' },      // street lights night
  { name: 'roads', id: '1558618666-fcd25c85cd64' },           // road repair
  { name: 'traffic', id: '1544620347-c4fd4a3d5957' },         // traffic signals
  { name: 'health', id: '1631213148792-fb31b377a7b2' },      // hospital / medical
  { name: 'parks', id: '1519608487953-e999c86e7455' },        // city park
  { name: 'housing', id: '1504307651254-35680f356dfd' },      // construction
];

function download(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { headers: { 'User-Agent': 'AI-Grievance-Portal/1.0' } }, (res) => {
      const chunks = [];
      res.on('data', (chunk) => chunks.push(chunk));
      res.on('end', () => resolve(Buffer.concat(chunks)));
      res.on('error', reject);
    }).on('error', reject);
  });
}

async function run() {
  if (!fs.existsSync(OUT_DIR)) {
    fs.mkdirSync(OUT_DIR, { recursive: true });
    console.log('Created', OUT_DIR);
  }

  let sharp;
  try {
    sharp = require('sharp');
  } catch (_) {
    console.log('Sharp not installed. Install with: npm install --save-dev sharp');
    console.log('Saving images without compression.');
  }

  for (let i = 0; i < IMAGES.length; i++) {
    const { name, id } = IMAGES[i];
    const num = i + 1;
    const url = `https://images.unsplash.com/photo-${id}?w=${WIDTH}&q=${QUALITY}&fit=crop`;
    const outPath = path.join(OUT_DIR, `${num}.jpg`);
    try {
      console.log(`[${num}/8] Downloading ${name}...`);
      const buffer = await download(url);
      if (sharp) {
        try {
          await sharp(buffer)
            .resize(WIDTH, null, { withoutEnlargement: true })
            .jpeg({ quality: 82, mozjpeg: true })
            .toFile(outPath);
          console.log(`    Compressed → ${outPath}`);
        } catch (sharpErr) {
          fs.writeFileSync(outPath, buffer);
          console.log(`    Saved (no compress) → ${outPath}`);
        }
      } else {
        fs.writeFileSync(outPath, buffer);
        console.log(`    Saved → ${outPath}`);
      }
    } catch (err) {
      console.error(`    Error ${name}:`, err.message);
    }
  }
  console.log('Done. Images in public/civic-images/');
}

run();
