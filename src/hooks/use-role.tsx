
"use client";

import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Role, Profile } from '@/lib/types';
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
  const router = useRouter();

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
        
        // Use the role from the just-fetched profile for immediate consistency
        const fetchedRole = profile.role;
        setRoleState(fetchedRole);
        return fetchedRole;
      }
      return null;
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setLoading(true);
      if (session?.user) {
        if(session.user.id !== rawUser?.id) {
          await fetchUserAndProfile(session.user);
        }
      } else {
        setRawUser(null);
        setUser(null);
        setRoleState(null);
      }
      setLoading(false);
    });
    
    // Initial load
    (async () => {
      setLoading(true);
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

  const setRole = (newRole: Role) => {
    if (user && user.role !== newRole) {
        // This logic is for role switching from the user nav, not initial login
        const roles = user.role.split(', ') as Role[];
        if (roles.includes(newRole)) {
            setRoleState(newRole);
        }
    } else {
        setRoleState(newRole);
    }
  };
  
  const availableRoles: Role[] = useMemo(() => {
    // In a real app, this might come from the user's profile if they can have multiple roles
    return ["Super Admin", "Admin", "Teacher", "Security/Staff", "Parent"];
  }, []);

  const value = useMemo(() => ({ role, user, rawUser, setRole, availableRoles, loading }), [role, user, rawUser, availableRoles, loading]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
