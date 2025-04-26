/* Generate placeholder image for the new music sample pack */
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Directory paths
const imagesDir = path.join(__dirname, '..', 'assets', 'sample-packs');

// Create placeholder image for the music sample pack
const samplePack = {
  name: 'turquoise-ironman-preview.jpg',
  title: 'Las 0las Turquoise Ironman',
  color: '#1abc9c'
};

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create image
const canvas = createCanvas(400, 400);
const ctx = canvas.getContext('2d');

// Background gradient
const gradient = ctx.createLinearGradient(0, 0, 400, 400);
gradient.addColorStop(0, samplePack.color);
gradient.addColorStop(1, '#000000');
ctx.fillStyle = gradient;
ctx.fillRect(0, 0, 400, 400);

// Add text
ctx.font = 'bold 40px Arial';
ctx.fillStyle = '#ffffff';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';

// Split title into lines
const words = samplePack.title.split(' ');
ctx.fillText(words.slice(0, 2).join(' '), 200, 180);
ctx.fillText(words.slice(2).join(' '), 200, 230);

// Add music emoji
ctx.font = 'bold 60px Arial';
ctx.fillText('🪈', 200, 300);

// Save image
const buffer = canvas.toBuffer('image/jpeg');
fs.writeFileSync(path.join(imagesDir, samplePack.name), buffer);
console.log(`Created image: ${samplePack.name}`);

console.log('Music sample pack image created successfully!');
