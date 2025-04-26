/* Generate placeholder images for sample packs with superhero/villain names */
const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

// Directory paths
const imagesDir = path.join(__dirname, '..', 'assets', 'sample-packs');

// Create placeholder images for each sample pack
const samplePacks = [
  { name: 'crimson-phoenix-preview.jpg', title: 'Las 0las Crimson Phoenix 42', color: '#ff5e62' },
  { name: 'emerald-venom-preview.jpg', title: 'Las 0las Emerald Venom', color: '#2ecc71' },
  { name: 'cobalt-thanos-preview.jpg', title: 'Las 0las Cobalt Thanos', color: '#3498db' },
  { name: 'azure-panther-preview.jpg', title: 'Las 0las Azure Panther', color: '#2c3e50' },
  { name: 'scarlet-magneto-preview.jpg', title: 'Las 0las Scarlet Magneto', color: '#e74c3c' },
  { name: 'violet-hulk-preview.jpg', title: 'Las 0las Violet Hulk', color: '#9b59b6' },
  { name: 'golden-joker-preview.jpg', title: 'Las 0las Golden Joker', color: '#f1c40f' },
  { name: 'midnight-batman-preview.jpg', title: 'Las 0las Midnight Batman', color: '#34495e' },
  { name: 'silver-mystique-preview.jpg', title: 'Las 0las Silver Mystique', color: '#bdc3c7' },
  { name: 'neon-deadpool-preview.jpg', title: 'Las 0las Neon Deadpool', color: '#e91e63' }
];

// Create images directory if it doesn't exist
if (!fs.existsSync(imagesDir)) {
  fs.mkdirSync(imagesDir, { recursive: true });
}

// Create images
samplePacks.forEach(pack => {
  const canvas = createCanvas(400, 400);
  const ctx = canvas.getContext('2d');
  
  // Background gradient
  const gradient = ctx.createLinearGradient(0, 0, 400, 400);
  gradient.addColorStop(0, pack.color);
  gradient.addColorStop(1, '#000000');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 400, 400);
  
  // Add text
  ctx.font = 'bold 40px Arial';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Split title into lines if needed
  const words = pack.title.split(' ');
  if (words.length > 2) {
    ctx.fillText(words.slice(0, 2).join(' '), 200, 180);
    ctx.fillText(words.slice(2).join(' '), 200, 230);
  } else {
    ctx.fillText(pack.title, 200, 200);
  }
  
  // Save image
  const buffer = canvas.toBuffer('image/jpeg');
  fs.writeFileSync(path.join(imagesDir, pack.name), buffer);
  console.log(`Created image: ${pack.name}`);
});

console.log('All images created successfully!');
