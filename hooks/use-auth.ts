'use client';

import { useAuthStore } from '@/stores/auth-store';

export function useAuth() {
  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const accessToken = useAuthStore((state) => state.accessToken);
  const expiresAt = useAuthStore((state) => state.expiresAt);
  const login = useAuthStore((state) => state.login);
  const logout = useAuthStore((state) => state.logout);
  const refresh = useAuthStore((state) => state.refresh);

  return { user, isAuthenticated, accessToken, expiresAt, login, logout, refresh };
}
