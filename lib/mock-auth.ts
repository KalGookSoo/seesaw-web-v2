export type MockRole = 'ROLE_ADMIN' | 'ROLE_MANAGER' | 'ROLE_USER';

export type MockAuthentication = Readonly<{
  authenticated: boolean;
  username: string;
  roles: readonly MockRole[];
}>;

/**
 * 실제 인증 연동 전까지 상세 페이지의 권한별 UI를 확인하기 위한 임시 값입니다.
 */
export const MOCK_AUTHENTICATION: MockAuthentication = {
  authenticated: true,
  username: 'mock-user',
  roles: ['ROLE_ADMIN']
};
