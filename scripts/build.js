const fs = require('fs');
const path = require('path');

// 确保 build 目录存在
const buildDir = path.join(__dirname, '../build');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// 复制 craco 配置文件
fs.copyFileSync(
  path.join(__dirname, '../craco.config.js'),
  path.join(buildDir, 'craco.config.js')
); 