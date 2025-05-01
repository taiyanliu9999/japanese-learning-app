import { createClient } from '@supabase/supabase-js';

// 获取环境变量并添加调试日志
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

// 记录环境变量状态（不记录实际密钥）
console.log('Supabase配置状态:', {
  url: supabaseUrl ? '已配置' : '未配置',
  key: supabaseAnonKey ? '已配置' : '未配置',
  environment: process.env.NODE_ENV,
  buildTime: process.env.REACT_APP_BUILD_TIME || '未设置'
});

// 判断是否有可用配置
const hasValidConfig = !!(supabaseUrl && supabaseAnonKey);

// 创建Supabase客户端（即使没有配置也创建一个空的，防止运行时错误）
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabaseAnonKey || 'placeholder-key',
  {
    auth: {
      autoRefreshToken: hasValidConfig,
      persistSession: hasValidConfig,
      detectSessionInUrl: hasValidConfig
    }
  }
);

// 获取会话
export const getSession = async () => {
  if (!hasValidConfig) {
    console.info('Supabase身份验证未配置，跳过会话获取');
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error('获取会话错误:', error.message);
      return null;
    }
    return session;
  } catch (error) {
    console.error('获取会话时发生意外错误:', error);
    return null;
  }
};

// 刷新会话
export const refreshSession = async () => {
  if (!hasValidConfig) {
    console.info('Supabase身份验证未配置，跳过会话刷新');
    return null;
  }

  try {
    const { data: { session }, error } = await supabase.auth.refreshSession();
    if (error) {
      if (error.message.includes('Token expired') || error.message.includes('Invalid refresh token')) {
        console.log('会话已过期，需要重新登录');
        // 可以在这里添加重定向到登录页面的逻辑
        return null;
      }
      console.error('刷新会话错误:', error.message);
      return null;
    }
    return session;
  } catch (error) {
    console.error('刷新会话时发生意外错误:', error);
    return null;
  }
};

// 检查是否已认证
export const isAuthenticated = async () => {
  if (!hasValidConfig) {
    console.info('Supabase身份验证未配置，默认为未登录状态');
    return false;
  }
  
  const session = await getSession();
  return !!session;
}; 