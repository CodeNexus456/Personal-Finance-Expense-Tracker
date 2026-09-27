import fs from 'fs';
import path from 'path';
import zlib from 'zlib';

function createPNG(width, height, drawFn) {
  // RGBA buffer
  const buffer = Buffer.alloc(width * height * 4);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;
      const [r, g, b, a] = drawFn(x, y, width, height);
      buffer[idx] = r;
      buffer[idx + 1] = g;
      buffer[idx + 2] = b;
      buffer[idx + 3] = a;
    }
  }

  // PNG scanlines (each row starts with filter byte 0)
  const rowSize = width * 4 + 1;
  const scanlines = Buffer.alloc(height * rowSize);
  for (let y = 0; y < height; y++) {
    scanlines[y * rowSize] = 0; // Filter: None
    buffer.copy(scanlines, y * rowSize + 1, y * width * 4, (y + 1) * width * 4);
  }

  const compressed = zlib.deflateSync(scanlines);

  // CRC32 calculation
  function crc32(buf) {
    let c = 0xffffffff;
    for (let i = 0; i < buf.length; i++) {
      c ^= buf[i];
      for (let j = 0; j < 8; j++) {
        c = (c >>> 1) ^ (c & 1 ? 0xedb88320 : 0);
      }
    }
    return (c ^ 0xffffffff) >>> 0;
  }

  function chunk(type, data) {
    const len = Buffer.alloc(4);
    len.writeUInt32BE(data.length, 0);
    const typeBuf = Buffer.from(type, 'ascii');
    const crcBuf = Buffer.alloc(4);
    const crcVal = crc32(Buffer.concat([typeBuf, data]));
    crcBuf.writeUInt32BE(crcVal, 0);
    return Buffer.concat([len, typeBuf, data, crcBuf]);
  }

  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

  // IHDR
  const ihdrData = Buffer.alloc(13);
  ihdrData.writeUInt32BE(width, 0);
  ihdrData.writeUInt32BE(height, 4);
  ihdrData[8] = 8; // Bit depth: 8
  ihdrData[9] = 6; // Color type: RGBA
  ihdrData[10] = 0; // Compression: deflate
  ihdrData[11] = 0; // Filter: standard
  ihdrData[12] = 0; // Interlace: none
  const ihdr = chunk('IHDR', ihdrData);

  // IDAT
  const idat = chunk('IDAT', compressed);

  // IEND
  const iend = chunk('IEND', Buffer.alloc(0));

  return Buffer.concat([sig, ihdr, idat, iend]);
}

// Drawing function for FinTrack logo
function drawFinTrack(x, y, w, h) {
  // Normalized coords 0 to 1
  const nx = x / w;
  const ny = y / h;

  // Background rounded card (indigo gradient #4f46e5 to #3730a3)
  const bgR = Math.round(79 - ny * 24);
  const bgG = Math.round(70 - ny * 22);
  const bgB = Math.round(229 - ny * 66);

  // Wallet rectangle: nx in [0.2, 0.8], ny in [0.35, 0.75]
  const isWallet = nx >= 0.22 && nx <= 0.78 && ny >= 0.35 && ny <= 0.75;

  // Wallet flap line: ny in [0.35, 0.48]
  const isFlap = nx >= 0.22 && nx <= 0.78 && ny >= 0.35 && ny <= 0.48;

  // Card peeking out: nx in [0.28, 0.72], ny in [0.26, 0.38] (emerald green)
  const isCard = nx >= 0.28 && nx <= 0.72 && ny >= 0.26 && ny <= 0.38;

  // Gold coin / clasp: center at (0.65, 0.55), radius ~0.08
  const dx = nx - 0.65;
  const dy = ny - 0.55;
  const dist = Math.sqrt(dx * dx + dy * dy);
  const isCoin = dist <= 0.08;
  const isCoinBorder = dist <= 0.088 && dist >= 0.076;

  if (isCoinBorder) {
    return [255, 255, 255, 255];
  }
  if (isCoin) {
    return [245, 158, 11, 255]; // Amber gold #f59e0b
  }
  if (isFlap) {
    return [226, 232, 240, 255]; // Slate 200 #e2e8f0
  }
  if (isWallet) {
    return [255, 255, 255, 255]; // White wallet
  }
  if (isCard) {
    return [16, 185, 129, 255]; // Emerald #10b981
  }

  return [bgR, bgG, bgB, 255];
}

const publicDir = path.resolve(process.cwd(), 'public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// 1. 192x192
fs.writeFileSync(path.join(publicDir, 'pwa-192x192.png'), createPNG(192, 192, drawFinTrack));

// 2. 512x512
fs.writeFileSync(path.join(publicDir, 'pwa-512x512.png'), createPNG(512, 512, drawFinTrack));

// 3. Apple Touch Icon 180x180
fs.writeFileSync(path.join(publicDir, 'apple-touch-icon.png'), createPNG(180, 180, drawFinTrack));

// 4. Maskable 512x512 with safe-zone margin
fs.writeFileSync(
  path.join(publicDir, 'pwa-maskable-512x512.png'),
  createPNG(512, 512, (x, y, w, h) => {
    // scale coordinates by 0.8 to create safe-zone margin
    const cx = w / 2;
    const cy = h / 2;
    const scaledX = (x - cx) / 0.8 + cx;
    const scaledY = (y - cy) / 0.8 + cy;
    if (scaledX < 0 || scaledX >= w || scaledY < 0 || scaledY >= h) {
      return [79, 70, 229, 255]; // Solid background
    }
    return drawFinTrack(scaledX, scaledY, w, h);
  })
);

console.log('PWA PNG Icons generated successfully in public/');
