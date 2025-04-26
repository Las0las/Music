/* Create placeholder audio preview files for sample packs with superhero/villain names */
const fs = require('fs');
const path = require('path');

// Directory paths
const previewsDir = path.join(__dirname, '..', 'assets', 'sample-previews');
const placeholderFile = path.join(__dirname, '..', 'assets', 'sample-preview.mp3');

// Create placeholder preview files for each sample pack
const previewFiles = [
  'crimson-phoenix-preview.mp3',
  'emerald-venom-preview.mp3',
  'cobalt-thanos-preview.mp3',
  'azure-panther-preview.mp3',
  'scarlet-magneto-preview.mp3',
  'violet-hulk-preview.mp3',
  'golden-joker-preview.mp3',
  'midnight-batman-preview.mp3',
  'silver-mystique-preview.mp3',
  'neon-deadpool-preview.mp3'
];

// Check if placeholder file exists
if (!fs.existsSync(placeholderFile)) {
  console.error('Placeholder file not found:', placeholderFile);
  process.exit(1);
}

// Create preview files
previewFiles.forEach(file => {
  const targetFile = path.join(previewsDir, file);
  try {
    fs.copyFileSync(placeholderFile, targetFile);
    console.log(`Created preview file: ${file}`);
  } catch (err) {
    console.error(`Error creating ${file}:`, err);
  }
});

console.log('All preview files created successfully!');
