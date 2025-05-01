// This script sets environment variables for the application
// It will be run during the build process

const fs = require('fs');
const path = require('path');

// Define the environment variables
const ENV_VARS = {
  REACT_APP_SUPABASE_URL: 'https://tvminksjqvdhamspxtoh.supabase.co',
  REACT_APP_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInJlZiI6InR2bWlua3NqcXZkaGFtc3B4dG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTk3MzMsImV4cCI6MjA2MTY5NTczM30.w_Q-fJBymmrCFPvbOseU0rAAvOMTwd9HuJ4a0R9z3Rk',
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

// Create a debug page for direct testing
const debugHtmlContent = `
<!DOCTYPE html>
<html>
<head>
  <title>Environment Debug</title>
  <script src="./env.js"></script>
  <style>
    body { font-family: system-ui, sans-serif; padding: 20px; }
    pre { background: #f5f5f5; padding: 10px; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Environment Variables Debug</h1>
  <div id="env-info">Loading...</div>
  
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
  </script>
</body>
</html>
`;

const debugHtmlPath = path.join(publicDir, 'debug.html');
fs.writeFileSync(debugHtmlPath, debugHtmlContent);
console.log(`Created debug.html file at ${debugHtmlPath}`);

console.log('Environment setup complete!'); 