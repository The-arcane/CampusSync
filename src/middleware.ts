import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

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

  const { data: { user } } = await supabase.auth.getUser();
  const path = req.nextUrl.pathname;
  
  // If user is not logged in and is trying to access a protected route, redirect to login
  if (!user && path !== '/login' && path !== '/unauthorized') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  // If user is logged in, prevent them from accessing the login page
  if (user && path.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', req.url));
  }

  // If the user is logged in, check their role for protected routes
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    // If profile doesn't exist, sign out and redirect to login
    if (!profile) {
      await supabase.auth.signOut();
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    const userRole = profile.role;

    // If on the root path, redirect to role-specific dashboard
    if (path === '/') {
      const roleRedirectMap: { [key: string]: string } = {
        'Super Admin': '/super-admin/dashboard',
        'Admin': '/admin/dashboard',
        'Teacher': '/teacher/dashboard',
        'Security/Staff': '/security/dashboard',
        'Parent': '/parent/dashboard',
      };
      const dashboardUrl = roleRedirectMap[userRole] || '/login';
      return NextResponse.redirect(new URL(dashboardUrl, req.url));
    }


    // Role-based route protection
    if (path.startsWith('/super-admin') && userRole !== 'Super Admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    // Allow Super Admin to access Admin routes
    if (path.startsWith('/admin') && userRole !== 'Admin' && userRole !== 'Super Admin') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    if (path.startsWith('/teacher') && userRole !== 'Teacher') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    if (path.startsWith('/security') && userRole !== 'Security/Staff') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
    
    if (path.startsWith('/parent') && userRole !== 'Parent') {
      return NextResponse.redirect(new URL('/unauthorized', req.url));
    }
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
     * - unauthorized (unauthorized page)
     * - auth/ (Supabase auth callback)
     */
    '/((?!_next/static|_next/image|favicon.ico|api/.*|unauthorized|auth/.*).*)',
  ],
};
