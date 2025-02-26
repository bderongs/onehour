import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './lib/supabase/middleware';
import logger from './utils/logger';

export async function middleware(request: NextRequest) {
  try {
    // Create a response to modify its headers
    const response = NextResponse.next();
    
    // Create a Supabase client with the request and response
    const supabase = createClient(request, response);

    // Try to get the session
    const {
      data: { user },
      error: userError
    } = await supabase.auth.getUser();

    if (userError) {
      logger.error('Middleware: Error getting user:', userError);
    }

    logger.info('Middleware: Session check result', { 
      path: request.nextUrl.pathname,
      hasSession: !!user,
      userId: user?.id
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

    if (isProtectedRoute && !user) {
      logger.info('Middleware: Protected route accessed without authenticated user, redirecting to signin', {
        path: request.nextUrl.pathname,
      });

      const signinUrl = new URL('/auth/signin', request.url);
      signinUrl.searchParams.set('returnUrl', request.nextUrl.pathname);
      
      return NextResponse.redirect(signinUrl);
    }

    // Return the response with the session
    return response;
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