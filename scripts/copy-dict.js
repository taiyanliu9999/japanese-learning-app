const fs = require('fs');
const path = require('path');

const sourceDir = path.join(__dirname, '../public/dict');
const targetDir = path.join(__dirname, '../build/dict');

// Create target directory if it doesn't exist
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Copy all files from source to target directory
fs.readdirSync(sourceDir).forEach(file => {
  const sourcePath = path.join(sourceDir, file);
  const targetPath = path.join(targetDir, file);
  
  if (fs.statSync(sourcePath).isFile()) {
    fs.copyFileSync(sourcePath, targetPath);
    console.log(`Copied ${file} to build/dict/`);
  }
});

console.log('Dictionary files copy completed!'); 