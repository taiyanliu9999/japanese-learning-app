const fs = require('fs');
const path = require('path');

try {
  // 确保 build 目录存在
  const buildDir = path.join(__dirname, '../build');
  fs.mkdirSync(buildDir, { recursive: true });

  // 复制 craco 配置文件
  const cracoConfigSource = path.join(__dirname, '../craco.config.js');
  const cracoConfigDest = path.join(buildDir, 'craco.config.js');
  
  if (fs.existsSync(cracoConfigSource)) {
    fs.copyFileSync(cracoConfigSource, cracoConfigDest);
    console.log('Successfully copied craco.config.js to build directory');
  } else {
    console.error('craco.config.js not found in root directory');
    process.exit(1);
  }
} catch (error) {
  console.error('Error during build setup:', error);
  process.exit(1);
} 