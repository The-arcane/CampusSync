
import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import type { Role } from '@/lib/types';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();
  const path = req.nextUrl.pathname;

  const isSupabaseConfigured =
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY &&
    !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('YOUR_SUPABASE_URL');

  // Handle the case where Supabase is NOT configured.
  if (!isSupabaseConfigured) {
    // If we are not on the setup page, redirect to it.
    if (path !== '/setup') {
      return NextResponse.redirect(new URL('/setup', req.url));
    }
    // If we are on the setup page, allow access and do nothing else.
    return res;
  }

  // If Supabase is configured but the user is trying to access the setup page,
  // redirect them to the login page.
  if (path === '/setup') {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        get: (name: string) => req.cookies.get(name)?.value,
        set: (name: string, value: string, options) => {
          res.cookies.set({ name, value, ...options });
        },
        remove: (name: string, options) => {
          res.cookies.set({ name, value: '', ...options });
        },
      },
    }
  );

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const isLoginPage = path.endsWith('/login');

  // If user is not logged in and not trying to access a login page, redirect to the main login selector.
  if (!session) {
    if (path === '/login' || path.startsWith('/unauthorized')) {
      return res;
    }
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // If user is logged in, fetch profile.
  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  // If profile doesn't exist, sign out and redirect to login. This is a safeguard.
  if (!profile) {
    await supabase.auth.signOut();
    return NextResponse.redirect(new URL('/login', req.url));
  }

  const userRole = profile.role as Role;

  const roleRedirectMap: { [key in Role]: string } = {
    super_admin: '/super-admin/dashboard',
    admin: '/admin/dashboard',
    teacher: '/teacher/dashboard',
    security_staff: '/security/dashboard',
    parent: '/parent/dashboard',
  };

  // If a logged-in user tries to access any login page, redirect them to their dashboard.
  if (isLoginPage) {
    const dashboardUrl = roleRedirectMap[userRole] || '/login';
    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  // If on the root path, redirect to role-specific dashboard.
  if (path === '/') {
    const dashboardUrl = roleRedirectMap[userRole] || '/login';
    return NextResponse.redirect(new URL(dashboardUrl, req.url));
  }

  // Role-based route protection.
  if (path.startsWith('/super-admin') && userRole !== 'super_admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (
    path.startsWith('/admin') &&
    userRole !== 'admin' &&
    userRole !== 'super_admin'
  ) {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (path.startsWith('/teacher') && userRole !== 'teacher') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (path.startsWith('/security') && userRole !== 'security_staff') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  if (path.startsWith('/parent') && userRole !== 'parent') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - api/ (API routes)
     * - auth/ (Supabase auth callback)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/.*|auth/.*).*)',
  ],
};
