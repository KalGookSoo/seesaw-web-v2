import type { AuthenticatedUser } from '../types/auth';

export function contentPermissions(user: AuthenticatedUser | null, isAuthenticated: boolean, createdBy?: string | null, isSchedule = false) {
  const owner = Boolean(isAuthenticated && user?.username && createdBy && user.username === createdBy);
  const manager = Boolean(isAuthenticated && user?.authorities?.some((role) => role === 'ROLE_ADMIN' || role === 'ROLE_MANAGER'));
  return {
    owner,
    manager,
    canMove: manager,
    canEdit: owner || (isSchedule && manager),
    canDelete: owner || manager
  };
}
