import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Missing Supabase configuration. Authentication features will be disabled.');
}

export const supabase = createClient(
  supabaseUrl || '',
  supabaseAnonKey || ''
);

export const getSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('Error getting session:', error.message);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Unexpected error getting session:', error);
    return null;
  }
};

export const refreshSession = async () => {
  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) {
      if (error.message.includes('Token expired') || error.message.includes('Invalid refresh token')) {
        console.log('Session expired, redirecting to login...');
        // 可以在这里添加重定向到登录页面的逻辑
        return null;
      }
      console.error('Error refreshing session:', error.message);
      return null;
    }
    return session;
  } catch (error) {
    console.error('Unexpected error refreshing session:', error);
    return null;
  }
};

export const isAuthenticated = async () => {
  const session = await getSession();
  return !!session;
}; 