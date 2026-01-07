
"use client";

import React, { createContext, useState, useContext, useMemo, ReactNode } from 'react';
import type { Role, Profile } from '@/lib/types';
import { users } from '@/lib/mock-data';

type RoleContextType = {
  role: Role;
  user: Profile;
  setRole: (role: Role) => void;
  availableRoles: Role[];
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role>('Super Admin');

  const user = useMemo(() => {
    return users.find(u => u.role === role) || users[0];
  }, [role]);

  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };
  
  const availableRoles: Role[] = ["Super Admin", "Admin", "Teacher", "Security/Staff", "Parent"];

  const value = { role, user, setRole, availableRoles };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
