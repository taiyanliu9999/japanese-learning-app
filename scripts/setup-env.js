// This script sets environment variables for the application
// It will be run during the build process

const fs = require('fs');
const path = require('path');

// Define the environment variables
const ENV_VARS = {
  REACT_APP_SUPABASE_URL: 'https://tvminksjqvdhamspxtoh.supabase.co',
  REACT_APP_SUPABASE_ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInJlZiI6InR2bWlua3NqcXZkaGFtc3B4dG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTk3MzMsImV4cCI6MjA2MTY5NTczM30.w_Q-fJBymmrCFPvbOseU0rAAvOMTwd9HuJ4a0R9z3Rk',
};

console.log('Setting up environment variables...');

// Apply the environment variables to the process
Object.entries(ENV_VARS).forEach(([key, value]) => {
  process.env[key] = value;
  console.log(`Set ${key} to environment`);
});

// Create a file that will be included during the build process to expose these variables to the client
const buildDir = path.resolve(__dirname, '../public');
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Create an env.js file that will be loaded in index.html
const envJsContent = `
// This file is auto-generated - do not edit
window.env = ${JSON.stringify(ENV_VARS, null, 2)};
`;

fs.writeFileSync(path.join(buildDir, 'env.js'), envJsContent);
console.log('Created env.js file with environment variables');

// Also create a JSON file for reference
fs.writeFileSync(
  path.join(buildDir, 'env-config.json'),
  JSON.stringify({ 
    env: ENV_VARS,
    timestamp: new Date().toISOString() 
  }, null, 2)
);
console.log('Created env-config.json file');

console.log('Environment setup complete!'); 