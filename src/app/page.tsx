
'use client';

import { useRole } from '@/hooks/use-role';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const { rawUser, loading, role } = useRole();
  const router = useRouter();
  const [isRedirecting, setIsRedirecting] = useState(false);

  useEffect(() => {
    if (loading) {
      return; // Wait until loading is finished
    }
    
    if (isRedirecting) {
        return;
    }

    if (!rawUser) {
      // If no user is logged in, redirect to the login page
      setIsRedirecting(true);
      router.replace('/login');
      return;
    }

    if (role) {
      // If user is logged in and has a role, redirect to their dashboard
      setIsRedirecting(true);
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
          router.replace('/login'); // Fallback to login
          break;
      }
    }
    // If user is logged in but role is not yet determined, the loading screen will show
  }, [rawUser, loading, router, role, isRedirecting]);
  
  // Display a loading screen while checking auth state and redirecting
  return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background space-y-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
       {role ? (
          <p className="text-muted-foreground">Loading {role} Portal...</p>
        ) : (
          <p className="text-muted-foreground">Initializing...</p>
        )}
    </div>
  )
}
