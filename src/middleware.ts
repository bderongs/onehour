import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const res = NextResponse.next();
  const supabase = createMiddlewareClient({ req: request, res });

  // Refresh session if needed
  const {
    data: { session },
  } = await supabase.auth.getSession();

  // Protected routes patterns
  const protectedPatterns = [
    /^\/client\/.*/,      // Client routes
    /^\/admin\/.*/,       // Admin routes
    /^\/consultants\/.*\/edit/,  // Consultant edit routes
    /^\/sparks\/(manage|create|edit|ai-edit|ai-create).*/, // Protected spark routes
  ];

  // Check if the current path matches any protected pattern
  const isProtectedRoute = protectedPatterns.some(pattern => 
    pattern.test(request.nextUrl.pathname)
  );

  if (isProtectedRoute && !session) {
    // Redirect to login if accessing protected route without session
    const redirectUrl = new URL('/signin', request.url);
    redirectUrl.searchParams.set('redirect', request.nextUrl.pathname);
    return NextResponse.redirect(redirectUrl);
  }

  return res;
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    '/client/:path*',
    '/admin/:path*',
    '/consultants/:path*/edit',
    '/sparks/:path*',
  ],
} 