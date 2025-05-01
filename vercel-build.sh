#!/bin/bash

# 打印当前环境信息
echo "开始自定义构建脚本..."
echo "当前目录: $(pwd)"
echo "目录内容: $(ls -la)"

# 构建应用
echo "开始构建应用..."
npm run build

# 打印build目录结构
echo "构建完成，检查build目录..."
echo "Build目录内容:"
ls -la build

# 确保字典目录存在
if [ -d "build/dict" ]; then
  echo "字典目录存在，检查内容..."
  ls -la build/dict
else
  echo "字典目录不存在，创建并复制内容..."
  mkdir -p build/dict
  cp -r public/dict/* build/dict/
  echo "复制后的字典目录内容:"
  ls -la build/dict
fi

# 创建一个特殊的txt文件以便验证文件是否可访问
echo "创建测试文件..."
echo "Kuromoji词典可访问性测试文件" > build/dict/test-access.txt

# 确保_redirects文件存在
echo "确保_redirects文件存在..."
echo "/* /index.html 200" > build/static/_redirects
echo "/* /index.html 200" > build/_redirects

echo "自定义构建脚本完成" 