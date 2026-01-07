
"use client";

import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react';
import type { Role, Profile } from '@/lib/types';
import { users as mockUsers } from '@/lib/mock-data'; // keep mock for fallback
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

type RoleContextType = {
  role: Role | null;
  user: (Profile & { email?: string }) | null;
  rawUser: User | null;
  setRole: (role: Role) => void;
  availableRoles: Role[];
  loading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);
  const [user, setUser] = useState<(Profile & { email?: string }) | null>(null);
  const [rawUser, setRawUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserSession = async () => {
      setLoading(true);
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session?.user) {
        setRawUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          setUser({ ...profile, email: session.user.email });
          setRoleState(profile.role);
        }
      }
      setLoading(false);
    };

    fetchUserSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        setRawUser(session.user);
         supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()
          .then(({ data: profile }) => {
            if (profile) {
              setUser({ ...profile, email: session.user.email });
              setRoleState(profile.role);
            }
          });
      } else {
        setRawUser(null);
        setUser(null);
        setRoleState(null);
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);


  const setRole = (newRole: Role) => {
    setRoleState(newRole);
  };
  
  // For demo switching purposes, this could be adjusted based on real logic
  const availableRoles: Role[] = ["Super Admin", "Admin", "Teacher", "Security/Staff", "Parent"];

  const value = { role, user, rawUser, setRole, availableRoles, loading };

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
