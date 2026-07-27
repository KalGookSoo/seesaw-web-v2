import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { decodeJwt } from '@/lib/jwt';
import type { AuthenticatedUser, JsonWebToken } from '@/types/auth';

const AUTH_STORAGE_KEY = 'seesaw-auth';
const REFRESH_BUFFER_MS = 60_000;

type AuthState = Readonly<{
  accessToken: string | null;
  refreshToken: string | null;
  expiresAt: number | null;
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (tokens: JsonWebToken) => void;
  logout: () => void;
  refresh: () => Promise<boolean>;
}>;

let refreshTimer: ReturnType<typeof setTimeout> | null = null;

function clearRefreshTimer() {
  if (refreshTimer) {
    clearTimeout(refreshTimer);
    refreshTimer = null;
  }
}

function scheduleRefresh(expiresAt: number) {
  clearRefreshTimer();
  const delay = Math.max(expiresAt - Date.now() - REFRESH_BUFFER_MS, 0);
  refreshTimer = setTimeout(() => {
    void useAuthStore.getState().refresh();
  }, delay);
}

function toUser(accessToken: string): AuthenticatedUser | null {
  const payload = decodeJwt(accessToken);
  if (!payload?.sub || !payload.userId) {
    return null;
  }

  return {
    userId: payload.userId,
    username: payload.sub,
    authorities: payload.authorities ?? []
  };
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      expiresAt: null,
      user: null,
      isAuthenticated: false,
      login: (tokens) => {
        if (!tokens.accessToken || !tokens.refreshToken || !tokens.expiresIn) {
          return;
        }

        const user = toUser(tokens.accessToken);
        const expiresAt = Date.now() + tokens.expiresIn;
        set({
          accessToken: tokens.accessToken,
          refreshToken: tokens.refreshToken,
          expiresAt,
          user,
          isAuthenticated: user !== null
        });
        scheduleRefresh(expiresAt);
      },
      logout: () => {
        clearRefreshTimer();
        set({ accessToken: null, refreshToken: null, expiresAt: null, user: null, isAuthenticated: false });
      },
      refresh: async () => {
        const { refreshToken } = get();
        if (!refreshToken) {
          get().logout();
          return false;
        }

        try {
          const response = await fetch('/api/token/refresh', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          if (!response.ok) {
            throw new Error(`토큰 갱신 실패: ${response.status}`);
          }

          const tokens = (await response.json()) as JsonWebToken;
          get().login(tokens);
          return true;
        } catch (error) {
          console.error('토큰 갱신에 실패했습니다.', error);
          get().logout();
          return false;
        }
      }
    }),
    {
      name: AUTH_STORAGE_KEY,
      onRehydrateStorage: () => (state) => {
        if (!state?.expiresAt || !state.refreshToken) {
          return;
        }

        if (state.expiresAt - Date.now() > REFRESH_BUFFER_MS) {
          scheduleRefresh(state.expiresAt);
        } else {
          void useAuthStore.getState().refresh();
        }
      }
    }
  )
);
