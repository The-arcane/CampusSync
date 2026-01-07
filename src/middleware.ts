import { NextResponse, type NextRequest } from 'next/server';
import { createServerClient } from '@supabase/ssr';

export async function middleware(req: NextRequest) {
  const res = NextResponse.next();

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
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

  const { data: { session } } = await supabase.auth.getSession();
  
  // If user is not logged in and is not on the login page, redirect to login
  if (!session && !req.nextUrl.pathname.startsWith('/login')) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  
  // If user is logged in, prevent them from accessing the login page
  if (session && req.nextUrl.pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/', req.url));
  }

  // If user is not logged in, no further checks are needed
  if (!session) {
    return res;
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', session.user.id)
    .single();

  if (!profile) {
     return NextResponse.redirect(new URL('/login', req.url));
  }

  const path = req.nextUrl.pathname;
  const userRole = profile.role;

  // Role-based route protection
  if (path.startsWith('/super-admin') && userRole !== 'Super Admin') {
    return NextResponse.redirect(new URL('/unauthorized', req.url));
  }
  
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

  return res;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.png$).*)',
  ],
};
