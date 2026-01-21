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
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Loading...</p>
      </div>
    );
  }

  return (
    <RoleProvider>
      {children}
      <Toaster />
    </RoleProvider>
  );
}
