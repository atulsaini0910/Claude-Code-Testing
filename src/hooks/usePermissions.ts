import { useMemo } from 'react';
import { useUsers } from './useUsers';
import type { UserRole } from '../types';

export interface Permissions {
  canDelete: boolean;
  canBulkEdit: boolean;
  canViewAnalytics: boolean;
  canManageTeam: boolean;
  canExport: boolean;
  canImport: boolean;
  canEditSettings: boolean;
  isReadOnly: boolean;
}

const ROLE_WEIGHTS: Record<UserRole, number> = {
  admin: 4, manager: 3, agent: 2, readonly: 1,
};

export function usePermissions(): Permissions {
  const { currentUser } = useUsers();
  const role = currentUser?.role ?? 'readonly';
  const weight = ROLE_WEIGHTS[role];

  return useMemo<Permissions>(() => ({
    canDelete:       weight >= ROLE_WEIGHTS.manager,
    canBulkEdit:     weight >= ROLE_WEIGHTS.manager,
    canViewAnalytics:weight >= ROLE_WEIGHTS.manager,
    canManageTeam:   weight >= ROLE_WEIGHTS.admin,
    canExport:       weight >= ROLE_WEIGHTS.manager,
    canImport:       weight >= ROLE_WEIGHTS.manager,
    canEditSettings: weight >= ROLE_WEIGHTS.admin,
    isReadOnly:      weight <= ROLE_WEIGHTS.readonly,
  }), [weight]);
}
