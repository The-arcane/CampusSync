import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_ANON_KEY!,
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

  // If user is not logged in and is trying to access a protected route, redirect to login
  if (!user && req.nextUrl.pathname !== '/login') {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }
  
  // If user is logged in, prevent them from accessing the login page
  if (user && req.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', req.url));
  }

  // If the user is logged in and on a protected route, check their role
  if (user) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (!profile) {
      await supabase.auth.signOut();
      const url = req.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
    
    const path = req.nextUrl.pathname;
    const userRole = profile.role;

    const roleRedirectMap: { [key: string]: string } = {
        'Super Admin': '/super-admin/dashboard',
        'Admin': '/admin/dashboard',
        'Teacher': '/teacher/dashboard',
        'Security/Staff': '/security/dashboard',
        'Parent': '/parent/dashboard',
    };

    if (path === '/') {
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
     */
    '/((?!_next/static|_next/image|favicon.ico|api/.*|unauthorized).*)',
  ],
};
