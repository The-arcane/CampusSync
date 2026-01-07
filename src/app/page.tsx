
'use client';

import { useRole } from '@/hooks/use-role';

export default function Home() {
  const { loading } = useRole();
  
  // The middleware now handles all redirection logic.
  // This page just needs to show a loading state while the initial auth check completes.
  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-background space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Initializing...</p>
      </div>
    );
  }

  // A fallback in case the middleware fails or the user somehow lands here.
  return (
     <div className="flex min-h-screen flex-col items-center justify-center bg-background space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        <p className="text-muted-foreground">Redirecting...</p>
      </div>
  )
}
