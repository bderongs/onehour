import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createClient } from './lib/supabase/middleware';
import logger from './utils/logger';

// Helper function to create a promise that rejects after a timeout
const withTimeout = <T>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => reject(new Error(errorMessage)), timeoutMs);
  });
  return Promise.race([promise, timeoutPromise]);
};

export async function middleware(request: NextRequest) {
  try {
    // Create a response to modify its headers
    const response = NextResponse.next();
    
    // Create a Supabase client with the request and response
    const supabase = createClient(request, response);

    // Try to get the session with a timeout to prevent hanging
    const sessionPromise = supabase.auth.getSession();
    const { data: { session }, error: sessionError } = await withTimeout(
      sessionPromise,
      2000, // 2 second timeout
      'Auth session request timed out'
    );

    if (sessionError) {
      logger.error('Middleware: Error getting session:', sessionError);
    }

    const user = session?.user;

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
    // If there's a timeout or other error, allow the request to proceed
    // This prevents the middleware from blocking legitimate requests
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