
'use client';
import Image from 'next/image';
import { LoginForm } from '@/components/auth/login-form';
import { BookOpenCheck } from 'lucide-react';
import placeholderImages from '@/lib/placeholder-images.json';
import { useRole } from '@/hooks/use-role';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const heroImage = placeholderImages.placeholderImages.find(p => p.id === "login-hero");
  const { rawUser, loading, role } = useRole();
  const router = useRouter();

  useEffect(() => {
    // If a user is already logged in and we know their role, redirect them away from the login page.
    if (!loading && rawUser && role) {
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
          // Stay on login page if role is somehow invalid
          break;
      }
    }
  }, [rawUser, loading, router, role]);
  
  // While checking auth or if user is logged in and redirecting, show a loading screen.
  if (loading || rawUser) {
    return (
       <div className="flex min-h-screen flex-col items-center justify-center bg-background space-y-4">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary border-t-transparent" />
        {role ? (
            <p className="text-muted-foreground">Loading {role} Portal...</p>
        ) : (
          <p className="text-muted-foreground">Initializing...</p>
        )}
      </div>
    );
  }

  // Only show the login form if there is no user and auth check is complete.
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-background p-4 md:p-8">
      <div className="w-full max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-16 items-center">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <div className="flex items-center gap-3 mb-4">
              <BookOpenCheck className="h-10 w-10 text-primary" />
              <h1 className="text-4xl md:text-5xl font-bold font-headline tracking-tighter text-primary">
                CampusSync
              </h1>
            </div>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-md">
              Streamlining school management for a connected and efficient
              educational experience.
            </p>
            <div className="w-full max-w-sm">
              <LoginForm />
            </div>
          </div>
          <div className="hidden md:block">
            {heroImage && (
              <Image
                src={heroImage.imageUrl}
                alt={heroImage.description}
                width={600}
                height={400}
                className="rounded-lg shadow-2xl object-cover"
                data-ai-hint={heroImage.imageHint}
                priority
              />
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
