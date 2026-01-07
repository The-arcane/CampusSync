
// This is the root page. The middleware handles all redirection logic.
// If a user lands here, the middleware will redirect them to either
// the login page or their role-specific dashboard.
// This page component can be empty or show a generic loading state,
// but it will likely never be seen by the end-user.
export default function Home() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background space-y-4">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      <p className="text-muted-foreground">Loading...</p>
    </div>
  );
}
