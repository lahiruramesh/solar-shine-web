import { supabase } from '@/integrations/supabase/client';

interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  email: string;
  role?: string;
}

export const loginAdmin = async (credentials: LoginCredentials): Promise<{ user: AuthUser | null; error: string | null }> => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: credentials.email,
    password: credentials.password,
  });

  if (error) {
    console.error('Login error:', error);
    return { user: null, error: error.message };
  }

  if (!data.user) {
    return { user: null, error: 'Authentication failed' };
  }

  // Success - return user data without hardcoded role
  return {
    user: {
      id: data.user.id,
      email: data.user.email || '',
    },
    error: null,
  };
};

export const logoutAdmin = async (): Promise<{ error: string | null }> => {
  const { error } = await supabase.auth.signOut();
  
  if (error) {
    console.error('Logout error:', error);
    return { error: error.message };
  }
  
  return { error: null };
};

export const getCurrentUser = async (): Promise<AuthUser | null> => {
  const { data } = await supabase.auth.getSession();
  
  if (!data.session?.user) {
    return null;
  }
  
  // Return user data without hardcoded role
  return {
    id: data.session.user.id,
    email: data.session.user.email || '',
  };
};

export const checkIsAuthenticated = async (): Promise<boolean> => {
  const user = await getCurrentUser();
  return !!user;
};
