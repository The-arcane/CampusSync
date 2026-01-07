
'use client';

import { useRole } from '@/hooks/use-role';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { rawUser, loading, role } = useRole();
  const router = useRouter();

  useEffect(() => {
    if (loading) {
      return; // Wait until auth state is determined
    }

    if (rawUser && role) {
      // If user is logged in, redirect to their specific dashboard
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
          router.replace('/login'); // Fallback if role is unknown
          break;
      }
    } else if (!rawUser) {
      // If no user is logged in, redirect to the login page
      router.replace('/login');
    }
  }, [rawUser, loading, router, role]);
  
  // Display a full-page loading indicator while the logic runs
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background space-y-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-muted-foreground">Initializing...</p>
    </div>
  )
}
