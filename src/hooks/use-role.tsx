
"use client";

import React, { createContext, useState, useContext, useMemo, ReactNode, useEffect } from 'react';
import type { Role, Profile } from '@/lib/types';
import { supabase } from '@/lib/supabase';
import type { User } from '@supabase/supabase-js';

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

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
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
            setRoleState(profile.role as Role);
          } else {
            // If user exists in auth but not profiles, sign out
            await supabase.auth.signOut();
          }
        } catch (error) {
          console.error("Error fetching profile:", error);
          // Sign out on error to prevent inconsistent state
          await supabase.auth.signOut();
          setUser(null);
          setRoleState(null);
          setRawUser(null);
        }
      } else {
        // User is signed out
        setUser(null);
        setRoleState(null);
        setRawUser(null);
      }
      // The initial check is done (or a change happened), so stop loading.
      setLoading(false);
    });

    return () => {
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
