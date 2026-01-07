
"use client";

import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react';
import type { Role, Profile } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

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
    const fetchUserAndProfile = async (sessionUser: User) => {
      setRawUser(sessionUser);
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', sessionUser.id)
        .single();
      
      if (profile) {
        const fullUser = { ...profile, email: sessionUser.email };
        setUser(fullUser);
        setRoleState(profile.role);
      }
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      if (session?.user) {
         await fetchUserAndProfile(session.user);
      } else {
        setRawUser(null);
        setUser(null);
        setRoleState(null);
      }
      setLoading(false);
    });
    
    // Initial load
    (async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.user) {
        await fetchUserAndProfile(session.user);
      }
      setLoading(false);
    })();


    return () => {
      subscription?.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const availableRoles: Role[] = useMemo(() => {
    return ["Super Admin", "Admin", "Teacher", "Security/Staff", "Parent"];
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
