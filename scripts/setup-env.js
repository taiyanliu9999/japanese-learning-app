// This script sets environment variables for the application
// It will be run during the build process

const fs = require('fs');
const path = require('path');

// Define the environment variables
const ENV_VARS = {
  REACT_APP_SUPABASE_URL: process.env.REACT_APP_SUPABASE_URL || 'https://tvminksjqvdhamspxtoh.supabase.co',
  REACT_APP_SUPABASE_ANON_KEY: process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInJlZiI6InR2bWlua3NqcXZkaGFtc3B4dG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTk3MzMsImV4cCI6MjA2MTY5NTczM30.w_Q-fJBymmrCFPvbOseU0rAAvOMTwd9HuJ4a0R9z3Rk',
  REACT_APP_BUILD_TIME: new Date().toISOString()
};

console.log('Setting up environment variables...');

// Apply the environment variables to the process
Object.entries(ENV_VARS).forEach(([key, value]) => {
  process.env[key] = value;
  console.log(`Set ${key} to environment: ${value.substring(0, 15)}...`);
});

// Ensure public directory exists
const publicDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
  console.log(`Created public directory: ${publicDir}`);
}

// Create an env.js file that will be loaded in index.html
const envJsContent = `
// This file is auto-generated - do not edit
window.env = ${JSON.stringify(ENV_VARS, null, 2)};
console.log("env.js loaded - Supabase URL:", window.env.REACT_APP_SUPABASE_URL ? window.env.REACT_APP_SUPABASE_URL.substring(0, 15) + "..." : "Not set");
`;

const envJsPath = path.join(publicDir, 'env.js');
fs.writeFileSync(envJsPath, envJsContent);
console.log(`Created env.js file at ${envJsPath}`);

// Also create a JSON file for reference
const envJsonPath = path.join(publicDir, 'env-config.json');
fs.writeFileSync(
  envJsonPath,
  JSON.stringify({ 
    env: ENV_VARS,
    timestamp: new Date().toISOString() 
  }, null, 2)
);
console.log(`Created env-config.json file at ${envJsonPath}`);

// Create a webpack polyfill script to handle Node.js modules
const polyfillJsContent = `
// Webpack polyfills for Node.js modules
if (typeof window !== 'undefined') {
  window.global = window;
  window.process = window.process || { env: {}, browser: true };
  window.Buffer = window.Buffer || { isBuffer: function() { return false; } };
  window.setImmediate = window.setImmediate || function(fn) { return setTimeout(fn, 0); };
  window.clearImmediate = window.clearImmediate || function(id) { clearTimeout(id); };
  
  // Polyfill for 'path' module used by kuromoji
  window.path = {
    basename: function(p, ext) {
      var f = p.split('/').pop();
      return ext && f.endsWith(ext) ? f.slice(0, -ext.length) : f;
    },
    dirname: function(p) {
      return p.split('/').slice(0, -1).join('/') || '.';
    },
    join: function() {
      return Array.from(arguments).join('/').replace(/\\/+/g, '/');
    },
    relative: function(from, to) {
      // Simple implementation
      return to;
    }
  };
}
console.log("Webpack polyfills loaded");
`;

const polyfillJsPath = path.join(publicDir, 'webpack-polyfills.js');
fs.writeFileSync(polyfillJsPath, polyfillJsContent);
console.log(`Created webpack-polyfills.js file at ${polyfillJsPath}`);

// Create a debug page for direct testing
const debugHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Environment Debug</title>
  <script src="./webpack-polyfills.js"></script>
  <script src="./env.js"></script>
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
    .status {
      padding: 10px;
      margin: 10px 0;
      border-radius: 4px;
    }
    .success {
      background-color: #e6f7e6;
      border: 1px solid #4caf50;
    }
    .error {
      background-color: #ffebee;
      border: 1px solid #f44336;
    }
    button {
      background-color: #4CAF50;
      color: white;
      padding: 10px 15px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      margin: 5px;
    }
  </style>
</head>
<body>
  <h1>Environment Variables Debug</h1>
  <div id="env-info">Loading...</div>
  
  <h2>Actions</h2>
  <div>
    <button onclick="testSupabaseConnection()">Test Supabase Connection</button>
    <button onclick="location.href='/'">Go to Main App</button>
    <button onclick="location.href='/direct-test.html'">Go to Direct Test</button>
  </div>
  
  <h2>Test Results:</h2>
  <pre id="test-results">No tests run yet</pre>
  
  <script>
    document.addEventListener('DOMContentLoaded', () => {
      const envInfo = document.getElementById('env-info');
      
      if (window.env) {
        envInfo.innerHTML = '<h2>window.env exists:</h2><pre>' + 
          JSON.stringify(window.env, null, 2) + '</pre>';
      } else {
        envInfo.innerHTML = '<h2>window.env does not exist</h2>';
      }
    });
    
    function testSupabaseConnection() {
      const results = document.getElementById('test-results');
      const supabaseUrl = window.env?.REACT_APP_SUPABASE_URL;
      const supabaseKey = window.env?.REACT_APP_SUPABASE_ANON_KEY;
      
      if (!supabaseUrl || !supabaseKey) {
        results.innerHTML = '<div class="status error">Missing Supabase credentials</div>';
        return;
      }
      
      results.innerHTML = 'Testing connection to Supabase...';
      
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
        results.innerHTML = '<div class="status success">Supabase connection successful</div><pre>' + 
          JSON.stringify(data, null, 2) + '</pre>';
      })
      .catch(error => {
        results.innerHTML = '<div class="status error">Supabase connection error: ' + 
          error.message + '</div>';
      });
    }
  </script>
</body>
</html>
`;

const debugHtmlPath = path.join(publicDir, 'debug.html');
fs.writeFileSync(debugHtmlPath, debugHtmlContent);
console.log(`Created debug.html file at ${debugHtmlPath}`);

console.log('Environment setup complete!'); 