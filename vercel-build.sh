#!/bin/bash

# Print environment information
echo "Starting custom build script..."
echo "Current directory: $(pwd)"
echo "Directory contents: $(ls -la)"

# Ensure Supabase environment variables are set - use fallbacks if needed
if [ -z "$REACT_APP_SUPABASE_URL" ]; then
  echo "Setting REACT_APP_SUPABASE_URL from fallback value"
  export REACT_APP_SUPABASE_URL="https://tvminksjqvdhamspxtoh.supabase.co"
else
  echo "REACT_APP_SUPABASE_URL: Already configured in environment"
fi

if [ -z "$REACT_APP_SUPABASE_ANON_KEY" ]; then
  echo "Setting REACT_APP_SUPABASE_ANON_KEY from fallback value"
  export REACT_APP_SUPABASE_ANON_KEY="eyJhbGciOiJIUzI1NiIsInJlZiI6InR2bWlua3NqcXZkaGFtc3B4dG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTk3MzMsImV4cCI6MjA2MTY5NTczM30.w_Q-fJBymmrCFPvbOseU0rAAvOMTwd9HuJ4a0R9z3Rk"
else
  echo "REACT_APP_SUPABASE_ANON_KEY: Already configured in environment"
fi

# Add build time environment variable for debugging
export REACT_APP_BUILD_TIME=$(date -u +"%Y-%m-%dT%H:%M:%SZ")
echo "BUILD_TIME: $REACT_APP_BUILD_TIME"

# Check Supabase configuration
echo "Checking Supabase environment variables..."
if [ -z "$REACT_APP_SUPABASE_URL" ]; then
  echo "WARNING: REACT_APP_SUPABASE_URL is not set"
else
  echo "REACT_APP_SUPABASE_URL: Configured"
fi

if [ -z "$REACT_APP_SUPABASE_ANON_KEY" ]; then
  echo "WARNING: REACT_APP_SUPABASE_ANON_KEY is not set"
else
  echo "REACT_APP_SUPABASE_ANON_KEY: Configured"
fi

# Generate env.js file
echo "Generating environment configuration files..."
mkdir -p public
cat > public/env.js << EOL
// This file is auto-generated - do not edit
window.env = {
  "REACT_APP_SUPABASE_URL": "${REACT_APP_SUPABASE_URL}",
  "REACT_APP_SUPABASE_ANON_KEY": "${REACT_APP_SUPABASE_ANON_KEY}",
  "REACT_APP_BUILD_TIME": "${REACT_APP_BUILD_TIME}"
};
EOL
echo "Created public/env.js with environment variables"

# Build the application
echo "Starting application build..."
npm run build

# Check build directory structure
echo "Build complete, checking build directory..."
echo "Build directory contents:"
ls -la build

# Ensure dictionary directory exists
if [ -d "build/dict" ]; then
  echo "Dictionary directory exists, checking contents..."
  ls -la build/dict
else
  echo "Dictionary directory doesn't exist, creating and copying contents..."
  mkdir -p build/dict
  cp -r public/dict/* build/dict/
  echo "Dictionary directory contents after copying:"
  ls -la build/dict
fi

# Copy env.js to build directory
echo "Copying env.js to build directory..."
cp public/env.js build/env.js

# Create a special txt file to verify file accessibility
echo "Creating test file..."
echo "Kuromoji dictionary accessibility test file - Build time: $REACT_APP_BUILD_TIME" > build/dict/test-access.txt

# Ensure _redirects file exists
echo "Ensuring _redirects file exists..."
echo "/* /index.html 200" > build/static/_redirects
echo "/* /index.html 200" > build/_redirects

# Create status file for debugging
echo "Creating status file..."
cat > build/build-info.json << EOL
{
  "buildTime": "$REACT_APP_BUILD_TIME",
  "supabaseConfigured": {
    "url": true,
    "key": true
  },
  "dictionaryFiles": $(ls -1 build/dict | wc -l),
  "env": {
    "url": "${REACT_APP_SUPABASE_URL}",
    "keyLength": ${#REACT_APP_SUPABASE_ANON_KEY}
  }
}
EOL

echo "Custom build script complete" 