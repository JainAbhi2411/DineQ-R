// Node.js script to generate PWA icons
// Run with: node scripts/generate-icons.js

const fs = require('fs');
const path = require('path');

// Simple SVG icon generator
const generateSVGIcon = (size, text = 'D') => {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="grad${size}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:#FF6B35;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#FF8C5A;stop-opacity:1" />
    </linearGradient>
  </defs>
  <rect width="${size}" height="${size}" rx="${size * 0.15}" fill="url(#grad${size})"/>
  <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${size * 0.5}" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="central">${text}</text>
</svg>`;
};

// Create icons directory
const iconsDir = path.join(__dirname, '..', 'public', 'icons');
if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir, { recursive: true });
}

// Generate icons for different sizes (using PNG naming for compatibility)
const sizes = [72, 96, 128, 144, 152, 192, 384, 512];

sizes.forEach(size => {
  const svg = generateSVGIcon(size, 'D');
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(iconsDir, filename);
  fs.writeFileSync(filepath, svg);
  console.log(`Generated: ${filename}`);
});

// Generate shortcut icons
const shortcuts = [
  { name: 'scan-icon.png', emoji: '📷', size: 96 },
  { name: 'orders-icon.png', emoji: '📋', size: 96 },
  { name: 'dashboard-icon.png', emoji: '📊', size: 96 }
];

shortcuts.forEach(({ name, emoji, size }) => {
  const svg = generateSVGIcon(size, emoji);
  const filepath = path.join(iconsDir, name);
  fs.writeFileSync(filepath, svg);
  console.log(`Generated: ${name}`);
});

console.log('\n✅ All PWA icons generated successfully!');
console.log(`📁 Location: ${iconsDir}`);
