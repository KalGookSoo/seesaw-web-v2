'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { authorizedFetch } from '@/lib/api-fetch';

export function useCategoryCreatePermission(categoryId: string) {
  const { isAuthenticated, user } = useAuth();
  const [result, setResult] = useState<{ key: string; allowed: boolean } | null>(null);
  const key = `${categoryId}:${isAuthenticated}:${user?.username ?? ''}:${user?.authorities?.join(',') ?? ''}`;

  useEffect(() => {
    if (!isAuthenticated || !user || !categoryId) return;
    const controller = new AbortController();
    async function check() {
      try {
        const [roleResponse, permissionResponse] = await Promise.all([
          authorizedFetch('/api/roles', { signal: controller.signal }),
          authorizedFetch(`/api/permissions?${new URLSearchParams({ targetId: categoryId })}`, { signal: controller.signal })
        ]);
        if (!roleResponse.ok || !permissionResponse.ok) throw new Error('권한 조회 실패');
        const { roles } = await roleResponse.json() as { roles: { id: string; name: string }[] };
        const { permissions } = await permissionResponse.json() as { permissions: { roleId: string; mask: number }[] };
        const authorities = user!.authorities;
        let allowed = authorities.some((role) => role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER');
        if (!allowed) {
          for (const authority of authorities) {
            const role = roles.find((item) => item.name === authority);
            const permission = role && permissions.find((item) => item.roleId === role.id);
            if (!permission) break;
            if ((permission.mask & 4) === 4) { allowed = true; break; }
          }
        }
        if (!controller.signal.aborted) setResult({ key, allowed });
      } catch {
        if (!controller.signal.aborted) setResult({ key, allowed: false });
      }
    }
    void check();
    return () => controller.abort();
  }, [categoryId, isAuthenticated, user, key]);

  return { canCreate: Boolean(isAuthenticated && result?.key === key && result.allowed), loading: Boolean(isAuthenticated && user && result?.key !== key) };
}
