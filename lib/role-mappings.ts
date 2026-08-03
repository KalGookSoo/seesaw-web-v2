import { APPLICATION_API_BASE_URL } from '@/lib/application-constants';

export async function removeMyRoleMapping(accessToken: string): Promise<void> {
  const response = await fetch(`${APPLICATION_API_BASE_URL}/role-mappings/me`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? '권한 제거에 실패했습니다.');
  }
}
