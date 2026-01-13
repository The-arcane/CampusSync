
'use client';

import { RoleProvider } from '@/hooks/use-role';
import { Toaster } from '@/components/ui/toaster';

export function ClientProviders({ children }: { children: React.ReactNode }) {
  return (
    <RoleProvider>
      {children}
      <Toaster />
    </RoleProvider>
  );
}
