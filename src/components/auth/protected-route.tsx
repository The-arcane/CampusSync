
'use client';

import { useRole } from '@/hooks/use-role';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { Role } from '@/lib/types';

export function ProtectedRoute({
  children,
  role: requiredRole,
}: {
  children: React.ReactNode;
  role: Role;
}) {
  const { role, rawUser, loading } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait until authentication state is loaded
    }

    // If there is no user, redirect to login
    if (!rawUser) {
      router.replace('/login');
      return;
    }

    // If the user has a role but it doesn't match the required one,
    // redirect them to their own dashboard.
    if (role && role !== requiredRole) {
       switch (role) {
        case 'Super Admin':
          router.replace('/super-admin/dashboard');
          break;
        case 'Admin':
          router.replace('/admin/dashboard');
          break;
        case 'Teacher':
          router.replace('/teacher/dashboard');
          break;
        case 'Security/Staff':
          router.replace('/security/dashboard');
          break;
        case 'Parent':
          router.replace('/parent/dashboard');
          break;
        default:
          router.replace('/login'); // Fallback
          break;
      }
    }
  }, [loading, rawUser, role, requiredRole, router]);

  // While loading or if redirection is happening, show a loading spinner
  if (loading || !rawUser || role !== requiredRole) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Verifying access...</p>
      </div>
    );
  }

  // If user is authenticated and has the correct role, render the children
  return <>{children}</>;
}
