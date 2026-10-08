/**
 * CareNova Demo Admin Authentication Service
 * 
 * Portfolio Demonstration Note:
 * This handles client-side demo authentication for the CareNova Admin Portal.
 * Passwords and admin secrets are not stored in Supabase or exposed to public clients.
 */

const ADMIN_STORAGE_KEY = 'carenova_admin_session';

export const DEMO_ADMIN_CREDENTIALS = {
  email: 'admin@carenova.demo',
  password: 'CareNovaDemo123',
  name: 'Portfolio Admin',
  role: 'Clinical Operations Director'
};

export interface AdminUser {
  email: string;
  name: string;
  role: string;
  loginTime: string;
}

export const isAdminAuthenticated = (): boolean => {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    return Boolean(session && session.email);
  } catch {
    return false;
  }
};

export const getAdminUser = (): AdminUser | null => {
  try {
    const raw = localStorage.getItem(ADMIN_STORAGE_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  } catch {
    return null;
  }
};

export const adminLogin = async (
  emailInput: string,
  passwordInput: string
): Promise<{ success: boolean; error?: string }> => {
  // Simulate standard network roundtrip latency for realism
  await new Promise((resolve) => setTimeout(resolve, 450));

  const emailClean = emailInput.trim().toLowerCase();
  const passwordClean = passwordInput.trim();

  if (!emailClean) {
    return { success: false, error: 'Please enter your admin email address.' };
  }
  if (!passwordClean) {
    return { success: false, error: 'Please enter your admin password.' };
  }

  if (
    emailClean === DEMO_ADMIN_CREDENTIALS.email.toLowerCase() &&
    passwordClean === DEMO_ADMIN_CREDENTIALS.password
  ) {
    const sessionUser: AdminUser = {
      email: DEMO_ADMIN_CREDENTIALS.email,
      name: DEMO_ADMIN_CREDENTIALS.name,
      role: DEMO_ADMIN_CREDENTIALS.role,
      loginTime: new Date().toISOString()
    };
    try {
      localStorage.setItem(ADMIN_STORAGE_KEY, JSON.stringify(sessionUser));
    } catch (e) {
      console.warn('LocalStorage error saving admin session:', e);
    }
    return { success: true };
  }

  return {
    success: false,
    error: 'Invalid credentials. Please use demo credentials: admin@carenova.demo / CareNovaDemo123'
  };
};

export const adminLogout = (): void => {
  try {
    localStorage.removeItem(ADMIN_STORAGE_KEY);
  } catch (e) {
    console.warn('LocalStorage error removing admin session:', e);
  }
};
