#!/bin/bash

# 打印当前环境信息
echo "开始自定义构建脚本..."
echo "当前目录: $(pwd)"
echo "目录内容: $(ls -la)"

# 添加构建时间环境变量，方便调试
export REACT_APP_BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "BUILD_TIME: $REACT_APP_BUILD_TIME"

# 检查Supabase配置
echo "检查Supabase环境变量状态..."
if [ -z "$REACT_APP_SUPABASE_URL" ]; then
  echo "警告: REACT_APP_SUPABASE_URL 未设置"
else
  echo "REACT_APP_SUPABASE_URL: 已配置"
fi

if [ -z "$REACT_APP_SUPABASE_ANON_KEY" ]; then
  echo "警告: REACT_APP_SUPABASE_ANON_KEY 未设置"
else
  echo "REACT_APP_SUPABASE_ANON_KEY: 已配置"
fi

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
echo "Kuromoji词典可访问性测试文件 - 构建时间: $REACT_APP_BUILD_TIME" > build/dict/test-access.txt

# 确保_redirects文件存在
echo "确保_redirects文件存在..."
echo "/* /index.html 200" > build/static/_redirects
echo "/* /index.html 200" > build/_redirects

# 创建状态文件，方便调试
echo "创建状态文件..."
cat > build/build-info.json << EOL
{
  "buildTime": "$REACT_APP_BUILD_TIME",
  "supabaseConfigured": {
    "url": ${REACT_APP_SUPABASE_URL:+true},
    "key": ${REACT_APP_SUPABASE_ANON_KEY:+true}
  },
  "dictionaryFiles": $(ls -1 build/dict | wc -l)
}
EOL

echo "自定义构建脚本完成" 