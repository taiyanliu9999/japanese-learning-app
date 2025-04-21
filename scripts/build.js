const fs = require('fs');
const path = require('path');

// 确保 scripts 目录存在
if (!fs.existsSync('scripts')) {
  fs.mkdirSync('scripts');
}

// 复制 craco 配置文件
fs.copyFileSync(
  path.join(__dirname, '../craco.config.js'),
  path.join(__dirname, '../build/craco.config.js')
); 