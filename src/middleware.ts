import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import logger from './utils/logger';

export async function middleware(request: NextRequest) {
  try {
    // Create a response to modify its headers
    const res = NextResponse.next();
    
    // Create a Supabase client with the request and response
    const supabase = createMiddlewareClient({ 
      req: request, 
      res,
    });

    // Try to get the session
    const {
      data: { session },
      error: sessionError
    } = await supabase.auth.getSession();

    if (sessionError) {
      logger.error('Middleware: Error getting session:', sessionError);
    }

    logger.info('Middleware: Session check result', { 
      path: request.nextUrl.pathname,
      hasSession: !!session,
      userId: session?.user?.id
    });

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
      logger.info('Middleware: Protected route accessed without session, redirecting to signin', {
        path: request.nextUrl.pathname,
      });

      const signinUrl = new URL('/signin', request.url);
      signinUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
      
      return NextResponse.redirect(signinUrl);
    }

    // Return the response with the session
    return res;
  } catch (error) {
    logger.error('Middleware: Unexpected error:', error);
    return NextResponse.next();
  }
}

// Specify which routes the middleware should run on
export const config = {
  matcher: [
    '/client/:path*',
    '/admin/:path*',
    '/consultants/:path*/edit',
    '/sparks/:path*',
  ],
}; 