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
console.log("env.js loaded with Supabase URL:", window.env.REACT_APP_SUPABASE_URL);
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

# Create a diagnostic HTML page
echo "Creating diagnostic HTML page..."
cat > build/status.html << EOL
<!DOCTYPE html>
<html>
<head>
  <title>Application Status</title>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <style>
    body { font-family: system-ui, sans-serif; line-height: 1.5; padding: 20px; max-width: 800px; margin: 0 auto; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 4px; overflow-x: auto; }
    .card { border: 1px solid #ddd; border-radius: 4px; padding: 15px; margin-bottom: 20px; }
    .success { background-color: #e6f7e6; border-color: #4caf50; }
    .error { background-color: #ffebee; border-color: #f44336; }
    .warning { background-color: #fff8e1; border-color: #ffc107; }
    table { width: 100%; border-collapse: collapse; }
    th, td { text-align: left; padding: 8px; border-bottom: 1px solid #ddd; }
    button { background-color: #4CAF50; color: white; padding: 10px 15px; border: none; border-radius: 4px; cursor: pointer; }
    button:hover { background-color: #45a049; }
  </style>
  <script src="/env.js"></script>
</head>
<body>
  <h1>Application Diagnostic Page</h1>
  <p>Build Time: ${REACT_APP_BUILD_TIME}</p>
  
  <div class="card">
    <h2>Environment Variables</h2>
    <table>
      <tr>
        <th>Variable</th>
        <th>Status</th>
      </tr>
      <tr>
        <td>REACT_APP_SUPABASE_URL</td>
        <td>${REACT_APP_SUPABASE_URL:0:15}...</td>
      </tr>
      <tr>
        <td>REACT_APP_SUPABASE_ANON_KEY</td>
        <td>${REACT_APP_SUPABASE_ANON_KEY:0:10}...</td>
      </tr>
    </table>
  </div>
  
  <div class="card" id="window-env-card">
    <h2>window.env Status</h2>
    <p>Checking window.env availability...</p>
  </div>
  
  <div class="card">
    <h2>Actions</h2>
    <p><button onclick="testDictAccess()">Test Dictionary Access</button></p>
    <p><button onclick="testSupabaseConnection()">Test Supabase Connection</button></p>
    <p><button onclick="window.location.href='/'">Go to Application</button></p>
  </div>
  
  <div class="card">
    <h2>Test Results</h2>
    <pre id="results">No tests run yet</pre>
  </div>
  
  <script>
    // Check window.env
    document.addEventListener('DOMContentLoaded', () => {
      const envCard = document.getElementById('window-env-card');
      if (window.env) {
        envCard.innerHTML = '<h2>window.env Status</h2>' +
          '<div class="success">✅ window.env is available</div>' +
          '<pre>' + JSON.stringify(window.env, null, 2) + '</pre>';
      } else {
        envCard.innerHTML = '<h2>window.env Status</h2>' +
          '<div class="error">❌ window.env is not available</div>';
      }
    });
    
    // Test dictionary access
    function testDictAccess() {
      const results = document.getElementById('results');
      results.textContent = 'Testing dictionary access...';
      
      fetch('/dict/test-access.txt')
        .then(response => {
          if (!response.ok) throw new Error('Dictionary not accessible: ' + response.status);
          return response.text();
        })
        .then(text => {
          results.textContent = 'Dictionary access successful:\n' + text;
        })
        .catch(error => {
          results.textContent = 'Dictionary access error: ' + error.message;
        });
    }
    
    // Test Supabase connection
    function testSupabaseConnection() {
      const results = document.getElementById('results');
      results.textContent = 'Testing Supabase connection...';
      
      const supabaseUrl = window.env?.REACT_APP_SUPABASE_URL || '${REACT_APP_SUPABASE_URL}';
      const supabaseKey = window.env?.REACT_APP_SUPABASE_ANON_KEY || '${REACT_APP_SUPABASE_ANON_KEY}';
      
      fetch(supabaseUrl + '/rest/v1/', {
        headers: {
          'apikey': supabaseKey,
          'Authorization': 'Bearer ' + supabaseKey
        }
      })
      .then(response => {
        if (!response.ok) throw new Error('Supabase connection failed: ' + response.status);
        return response.json();
      })
      .then(data => {
        results.textContent = 'Supabase connection successful:\n' + JSON.stringify(data, null, 2);
      })
      .catch(error => {
        results.textContent = 'Supabase connection error: ' + error.message;
      });
    }
  </script>
</body>
</html>
EOL
echo "Created status.html page in build directory"

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