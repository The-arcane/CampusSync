
'use client';

// The middleware handles all redirection logic.
// This page just needs to show a loading state while the initial auth check completes.
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background space-y-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-muted-foreground">Initializing...</p>
    </div>
  );
}
