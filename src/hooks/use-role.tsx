
"use client";

import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react';
import type { Role, Profile } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type RoleContextType = {
  role: Role | null;
  user: (Profile & { email?: string }) | null;
  rawUser: User | null;
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
    const handleAuthStateChange = async (session: Session | null) => {
      setLoading(true);
      
      if (session?.user) {
        setRawUser(session.user);
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (profile) {
          const fullUser = { ...profile, email: session.user.email };
          setUser(fullUser);
          setRoleState(profile.role);
        } else {
          // Profile not found, clear local state
          setUser(null);
          setRoleState(null);
          setRawUser(null);
        }
      } else {
        setUser(null);
        setRoleState(null);
        setRawUser(null);
      }
      setLoading(false);
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        handleAuthStateChange(session);
    });

    // Initial load check
    supabase.auth.getSession().then(({ data: { session } }) => {
        handleAuthStateChange(session);
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);
  
  const availableRoles: Role[] = useMemo(() => {
    return ["super_admin", "admin", "teacher", "security_staff", "parent"];
  }, []);

  const value = useMemo(() => ({ role, user, rawUser, availableRoles, loading }), [role, user, rawUser, availableRoles, loading]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
