import { createClient } from '@supabase/supabase-js';

// Define a type for the window.env property
declare global {
  interface Window {
    env?: {
      REACT_APP_SUPABASE_URL?: string;
      REACT_APP_SUPABASE_ANON_KEY?: string;
      [key: string]: any;
    };
  }
}

// Get environment variables with fallbacks from multiple sources
const getEnvVariable = (key: string) => {
  // First try window.env (set by our setup-env.js script)
  if (window.env && window.env[`REACT_APP_${key}`]) {
    console.log(`Found ${key} in window.env`);
    return window.env[`REACT_APP_${key}`];
  }

  // Then try different process.env formats
  const value = process.env[key] || 
         process.env[`REACT_APP_${key}`] || 
         process.env[`VITE_${key}`] ||
         process.env[`NEXT_PUBLIC_${key}`];
  
  if (value) {
    console.log(`Found ${key} in process.env`);
    return value;
  }

  console.log(`${key} not found in any environment variables`);
  return null;
};

// Hard-coded fallbacks as last resort
const FALLBACK_URL = 'https://tvminksjqvdhamspxtoh.supabase.co';
const FALLBACK_KEY = 'eyJhbGciOiJIUzI1NiIsInJlZiI6InR2bWlua3NqcXZkaGFtc3B4dG9oIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDYxMTk3MzMsImV4cCI6MjA2MTY5NTczM30.w_Q-fJBymmrCFPvbOseU0rAAvOMTwd9HuJ4a0R9z3Rk';

// Get environment variables with debugging
let supabaseUrl = getEnvVariable('SUPABASE_URL');
let supabaseAnonKey = getEnvVariable('SUPABASE_ANON_KEY');

// If not found, check if window.env exists directly with the full key names
if (!supabaseUrl && window.env && window.env.REACT_APP_SUPABASE_URL) {
  console.log('Using direct window.env.REACT_APP_SUPABASE_URL');
  supabaseUrl = window.env.REACT_APP_SUPABASE_URL;
}

if (!supabaseAnonKey && window.env && window.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.log('Using direct window.env.REACT_APP_SUPABASE_ANON_KEY');
  supabaseAnonKey = window.env.REACT_APP_SUPABASE_ANON_KEY;
}

// Use fallbacks if still not found
if (!supabaseUrl) {
  console.log('Using hardcoded fallback for Supabase URL');
  supabaseUrl = FALLBACK_URL;
}

if (!supabaseAnonKey) {
  console.log('Using hardcoded fallback for Supabase Anon Key');
  supabaseAnonKey = FALLBACK_KEY;
}

// Show full window.env content for debugging
console.log('window.env content:', window.env);

// Log environment variable status (without revealing actual keys)
console.log('Supabase configuration status:', {
  url: supabaseUrl,
  urlConfigured: !!supabaseUrl,
  keyConfigured: !!supabaseAnonKey,
  keyLength: supabaseAnonKey ? supabaseAnonKey.length : 0,
  source: window.env ? 'window.env' : 'process.env',
  environment: process.env.NODE_ENV,
  buildTime: process.env.REACT_APP_BUILD_TIME || (window.env?.REACT_APP_BUILD_TIME || 'not set'),
  windowEnvKeys: window.env ? Object.keys(window.env) : [],
  processEnvKeys: Object.keys(process.env).filter(key => key.includes('SUPABASE') || key.includes('REACT_APP')),
});

// Check if we have valid configuration
const hasValidConfig = !!(supabaseUrl && supabaseAnonKey);

// Create Supabase client
export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey,
  {
    auth: {
      autoRefreshToken: hasValidConfig,
      persistSession: hasValidConfig,
      detectSessionInUrl: hasValidConfig
    }
  }
);

// Get session
export const getSession = async () => {
  if (!hasValidConfig) {
    console.info('Supabase authentication not configured, skipping session retrieval');
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Unexpected error when getting session:', error);
    return null;
  }
};

// Refresh session
export const refreshSession = async () => {
  if (!hasValidConfig) {
    console.info('Supabase authentication not configured, skipping session refresh');
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) {
      if (error.message.includes('Token expired') || error.message.includes('Invalid refresh token')) {
        console.log('Session expired, need to log in again');
        // You can add logic here to redirect to login page
        return null;
      }
      console.error('Error refreshing session:', error.message);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Unexpected error when refreshing session:', error);
    return null;
  }
};

// Check if authenticated
export const isAuthenticated = async () => {
  if (!hasValidConfig) {
    console.info('Supabase authentication not configured, defaulting to not logged in');
    return false;
  }
  
  const session = await getSession();
  return !!session;
}; 