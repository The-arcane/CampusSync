'use client';

import { RoleProvider } from '@/hooks/use-role';
import { Toaster } from '@/components/ui/toaster';
import { useState, useEffect } from 'react';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <RoleProvider>
      {children}
      <Toaster />
    </RoleProvider>
  );
}
