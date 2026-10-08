const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Clean SVG emblem with tight viewBox and transparent background
const svgContent = `<svg width="512" height="512" viewBox="10 8 96 96" fill="none" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <!-- Luxury Gold Gradients -->
    <linearGradient id="goldGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#F9E29D" />
      <stop offset="35%" stop-color="#D4AF37" />
      <stop offset="70%" stop-color="#B38F2E" />
      <stop offset="100%" stop-color="#E6C765" />
    </linearGradient>

    <linearGradient id="goldGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#FFF2BF" />
      <stop offset="45%" stop-color="#C5A059" />
      <stop offset="100%" stop-color="#8C6B1C" />
    </linearGradient>

    <!-- Midnight Royal Blue for K fill -->
    <linearGradient id="midnightBlue" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#132B54" />
      <stop offset="50%" stop-color="#0B1A36" />
      <stop offset="100%" stop-color="#071226" />
    </linearGradient>
  </defs>

  <!-- Outer Golden Layered Frame (Rounded Square with open cut) -->
  <rect
    x="18"
    y="12"
    width="82"
    height="82"
    rx="16"
    fill="url(#midnightBlue)"
    stroke="url(#goldGrad1)"
    stroke-width="3.5"
  />

  <!-- Decorative Golden Corner Trim / Outer Shield Border -->
  <path
    d="M16 36 V 26 C 16 19 21 14 28 14 H 42"
    stroke="url(#goldGrad1)"
    stroke-width="4"
    stroke-linecap="round"
  />
  <path
    d="M20 90 V 78"
    stroke="url(#goldGrad1)"
    stroke-width="4"
    stroke-linecap="round"
  />

  <!-- Golden Book / Mattress Bedding Pages Fan (Bottom-Right) -->
  <path
    d="M62 76 C 70 76 80 82 96 90 C 85 91 74 88 64 86 Z"
    fill="url(#goldGrad1)"
  />
  <path
    d="M64 81 C 74 81 86 86 100 95 C 88 96 76 93 64 91 Z"
    fill="url(#goldGrad2)"
    stroke="url(#goldGrad1)"
    stroke-width="0.8"
  />
  <path
    d="M62 86 C 72 87 84 92 98 100 C 82 101 70 97 58 95 Z"
    fill="url(#goldGrad1)"
  />

  <!-- Stylized Bold Capital 'K' with Gold Bevel Border -->
  <!-- Vertical Stem of K -->
  <path
    d="M32 25 H 45 V 75 H 32 Z"
    fill="url(#midnightBlue)"
    stroke="url(#goldGrad1)"
    stroke-width="2.5"
    stroke-linejoin="round"
  />
  <!-- Top Diagonal Arm of K -->
  <path
    d="M45 50 L 72 25 H 85 L 53 54 Z"
    fill="url(#midnightBlue)"
    stroke="url(#goldGrad1)"
    stroke-width="2.5"
    stroke-linejoin="round"
  />
  <!-- Bottom Diagonal Leg of K -->
  <path
    d="M51 49 L 78 75 H 64 L 42 55 Z"
    fill="url(#midnightBlue)"
    stroke="url(#goldGrad1)"
    stroke-width="2.5"
    stroke-linejoin="round"
  />
  <!-- Inner Highlight Accent on K -->
  <line
    x1="36"
    y1="27"
    x2="36"
    y2="73"
    stroke="url(#goldGrad2)"
    stroke-width="1"
    stroke-opacity="0.7"
  />
</svg>`;

async function run() {
  const svgBuffer = Buffer.from(svgContent);

  // Save public/favicon.svg
  fs.writeFileSync(path.join(__dirname, '../public/favicon.svg'), svgContent);
  console.log('Saved public/favicon.svg');

  // Generate PNG sizes
  const sizes = [
    { name: 'public/icon.png', size: 512 },
    { name: 'public/icon-512.png', size: 512 },
    { name: 'public/icon-192.png', size: 192 },
    { name: 'public/apple-touch-icon.png', size: 180 },
    { name: 'public/icon-48.png', size: 48 },
    { name: 'public/icon-32.png', size: 32 },
    { name: 'public/icon-16.png', size: 16 },
    { name: 'app/icon.png', size: 512 },
    { name: 'app/apple-icon.png', size: 180 },
  ];

  for (const item of sizes) {
    const dest = path.join(__dirname, '..', item.name);
    await sharp(svgBuffer, { density: 300 })
      .resize(item.size, item.size)
      .png()
      .toFile(dest);
    console.log(`Saved ${item.name} (${item.size}x${item.size})`);
  }
}

run().catch(console.error);
