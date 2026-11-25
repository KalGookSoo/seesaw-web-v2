import { create } from 'zustand';
import { persist } from 'zustand/middleware';

import { authorizedFetch } from '@/lib/api-fetch';
import type { AuthenticatedUser, JsonWebToken } from '@/types/auth';

const AUTH_STORAGE_KEY = 'seesaw-auth';

type AuthState = Readonly<{
  expiresAt: number | null;
  user: AuthenticatedUser | null;
  isAuthenticated: boolean;
  login: (tokens: JsonWebToken) => Promise<void>;
  logout: () => Promise<void>;
  clearAuthentication: () => void;
  refresh: () => Promise<boolean>;
  bootstrap: () => Promise<void>;
}>;

async function fetchCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const response = await authorizedFetch('/api/me');
    if (!response.ok) {
      return null;
    }
    return (await response.json()) as AuthenticatedUser;
  } catch {
    return null;
  }
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      expiresAt: null,
      user: null,
      isAuthenticated: false,
      clearAuthentication: () => set({ expiresAt: null, user: null, isAuthenticated: false }),
      // 로그인 성공 응답(토큰)은 이미 서버가 httpOnly 쿠키로 내려준 상태다. 여기서는 그 값을 저장하지
      // 않고(JS가 토큰을 갖고 있지 않게 하는 것이 목적) /api/me로 본인 정보만 조회해 채운다.
      login: async (tokens) => {
        const user = await fetchCurrentUser();
        if (!user) {
          throw new Error('로그인 정보를 확인할 수 없습니다. 다시 로그인해주세요.');
        }
        set({
          expiresAt: tokens.expiresIn ? Date.now() + tokens.expiresIn : null,
          user,
          isAuthenticated: user !== null
        });
      },
      logout: async () => {
        try {
          await authorizedFetch('/api/sign-out', { method: 'POST' });
        } catch (error) {
          console.error('로그아웃 요청에 실패했습니다.', error);
        } finally {
          set({ expiresAt: null, user: null, isAuthenticated: false });
        }
      },
      refresh: async () => {
        try {
          const response = await authorizedFetch('/api/token/refresh', { method: 'POST' });
          if (!response.ok) {
            throw new Error(`토큰 갱신 실패: ${response.status}`);
          }

          const tokens = (await response.json()) as JsonWebToken;
          set({ expiresAt: tokens.expiresIn ? Date.now() + tokens.expiresIn : null });
          return true;
        } catch (error) {
          console.error('토큰 갱신에 실패했습니다.', error);
          await get().logout();
          return false;
        }
      },
      // 새로고침 등으로 앱이 다시 시작될 때, 로컬에 남아있던(persist된) 로그인 상태가 실제로도
      // 유효한지 서버에 다시 확인한다. persist된 값은 화면이 깜빡이지 않게 하는 낙관적 표시일 뿐이다.
      bootstrap: async () => {
        if (!get().isAuthenticated) {
          set({ user: null, isAuthenticated: false, expiresAt: null });
          return;
        }
        const user = await fetchCurrentUser();
        set({ user, isAuthenticated: user !== null, expiresAt: user !== null ? get().expiresAt : null });
      }
    }),
    {
      name: AUTH_STORAGE_KEY,
      // accessToken/refreshToken은 절대 저장하지 않는다(XSS로 탈취 가능한 localStorage에 두지 않는 것이
      // 이 스토어를 httpOnly 쿠키 기반으로 바꾼 목적이다). user/expiresAt는 민감 정보가 아니라
      // 새로고침 시 화면이 깜빡이지 않도록 낙관적으로만 사용하고, bootstrap()이 서버 상태로 재확인한다.
      partialize: (state) => ({
        user: state.user,
        expiresAt: state.expiresAt,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
);
