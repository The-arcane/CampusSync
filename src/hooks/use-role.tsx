
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
    
    // Set loading to true initially. The `finally` block in the auth listener 
    // will ensure it's set to false after the first check.
    setLoading(true);

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          setRawUser(session.user);
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          if (error) {
            // This can happen if RLS fails, network error, etc.
            // The safest thing to do is sign out to prevent an inconsistent state.
            console.error("Error fetching profile:", error.message);
            await supabase.auth.signOut();
          } else if (profile) {
            const fullUser = { ...profile, email: session.user.email };
            setUser(fullUser);
            setRoleState(profile.role as Role);
          } else {
            // If a user exists in Supabase auth but not in our public.profiles table,
            // it's an invalid state. Sign them out.
            console.warn("User has a session but no profile. Signing out.");
            await supabase.auth.signOut();
          }
        } else {
          // This block runs if the user is signed out (session is null)
          // or on initial load if there's no active session.
          setUser(null);
          setRoleState(null);
          setRawUser(null);
        }
      } catch (e) {
          // Catch any other unexpected errors during the process.
          console.error("Unexpected error in onAuthStateChange:", e);
          setUser(null);
          setRoleState(null);
          setRawUser(null);
      } finally {
        // This is crucial: it guarantees that loading is set to false
        // after the initial auth check is complete, preventing a perpetual loading state.
        setLoading(false);
      }
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
