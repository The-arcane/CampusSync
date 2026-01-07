
"use client";

import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import type { Role, Profile } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type RoleContextType = {
  role: Role | null;
  user: (Profile & { email?: string }) | null;
  rawUser: User | null;
  availableRoles: Role[];
  loading: boolean;
  isRedirecting: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);
  const [user, setUser] = useState<(Profile & { email?: string }) | null>(null);
  const [rawUser, setRawUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const handleAuthStateChange = async (session: Session | null) => {
      setLoading(true);
      setIsRedirecting(true); // Start redirecting
      
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
          
          const roleRedirectMap: { [key in Role]: string } = {
            'super_admin': '/super-admin/dashboard',
            'admin': '/admin/dashboard',
            'teacher': '/teacher/dashboard',
            'security_staff': '/security/dashboard',
            'parent': '/parent/dashboard',
          };
          const dashboardUrl = roleRedirectMap[profile.role] || '/login';
          router.replace(dashboardUrl);
        } else {
          // Profile not found, sign out
          await supabase.auth.signOut();
          setUser(null);
          setRoleState(null);
          setRawUser(null);
          router.replace('/login');
        }
      } else {
        setUser(null);
        setRoleState(null);
        setRawUser(null);
        router.replace('/login');
      }

      setLoading(false);
      setIsRedirecting(false); // End redirecting
    };

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
        handleAuthStateChange(session);
    });

    // Initial load check
    supabase.auth.getSession().then(({ data: { session } }) => {
        if (!session) {
            setLoading(false);
            setIsRedirecting(false);
        }
    });

    return () => {
      subscription?.unsubscribe();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  const availableRoles: Role[] = useMemo(() => {
    return ["super_admin", "admin", "teacher", "security_staff", "parent"];
  }, []);

  const value = useMemo(() => ({ role, user, rawUser, availableRoles, loading, isRedirecting }), [role, user, rawUser, availableRoles, loading, isRedirecting]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
