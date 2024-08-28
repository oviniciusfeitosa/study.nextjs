import NextAuth from 'next-auth';
import { NextResponse } from 'next/server';

import { authConfig } from '@/lib/auth.config';
import { API_AUTH_PREFIX, AUTH_ROUTES, PROTECTED_ROUTES } from '@/routes';

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const pathname = req.nextUrl.pathname;
  const isApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);

  if (isApiAuthRoute) {
    return NextResponse.next();
  }

  const isAccessingAuthRoute = AUTH_ROUTES.some((route) => pathname.startsWith(route));
  const isAuthenticated = req.auth;

  if (isAccessingAuthRoute) {
    if (isAuthenticated) {
      // return NextResponse.redirect(new URL('/', req.url));
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    return NextResponse.next();
  }

  const isAccessingProtectedRoute = PROTECTED_ROUTES.some((route) => pathname.startsWith(route));

  if (!isAuthenticated && isAccessingProtectedRoute) {
    // return NextResponse.redirect(new URL('/sign-in', req.url));
    return NextResponse.redirect(new URL('/auth/signin', req.url));
  }
});

export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
