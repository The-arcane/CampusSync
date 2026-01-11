
"use client";

import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react';
import type { Role, Profile } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import type { User, Session } from '@supabase/supabase-js';

type RoleContextType = {
  role: Role | null;
  user: (Profile & { email?: string }) | null;
  rawUser: User | null;
  loading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRoleState] = useState<Role | null>(null);
  const [user, setUser] = useState<(Profile & { email?: string }) | null>(null);
  const [rawUser, setRawUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const handleAuthStateChange = async (event: string, session: Session | null) => {
    setLoading(true);
    if (session?.user) {
      setRawUser(session.user);
      try {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();
        
        if (error) throw error;

        if (profile) {
          const fullUser = { ...profile, email: session.user.email };
          setUser(fullUser);
          setRoleState(profile.role);
        } else {
          // This case might happen if a user is deleted from the db but the auth user still exists.
          await supabase.auth.signOut();
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        await supabase.auth.signOut(); // Sign out on error to prevent inconsistent state
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

  useEffect(() => {
    // Immediately check for an existing session when the provider mounts.
    // This handles the initial load and tab-switching scenarios.
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthStateChange('INITIAL_SESSION', session);
      } else {
        setLoading(false);
      }
    });

    // Listen for all future auth state changes.
    const { data: { subscription } } = supabase.auth.onAuthStateChange(handleAuthStateChange);

    return () => {
      // Cleanup the subscription when the component unmounts.
      subscription?.unsubscribe();
    };
  }, []);
  
  const value = useMemo(() => ({ role, user, rawUser, loading }), [role, user, rawUser, loading]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
}

export function useRole() {
  const context = useContext(RoleContext);
  if (context === undefined) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
}
