import { authorizedFetch } from '@/lib/api-fetch';

export async function removeMyRoleMapping(): Promise<void> {
  const response = await authorizedFetch('/api/role-mappings/me', {
    method: 'DELETE'
  });

  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as { message?: string } | null;
    throw new Error(body?.message ?? '권한 제거에 실패했습니다.');
  }
}
