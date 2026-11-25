'use client';

import { useAuthStore } from '@/stores/auth-store';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const refresh = useAuthStore((state) => state.refresh);
  const bootstrap = useAuthStore((state) => state.bootstrap);
  const clearAuthentication = useAuthStore((state) => state.clearAuthentication);

  return { user, isAuthenticated, expiresAt, login, logout, refresh, bootstrap, clearAuthentication };
}
