import { NextRequest, NextResponse } from 'next/server';
import { runWithAmplifyServerContext } from '@/lib/amplify-server-utils';
import { fetchAuthSession } from 'aws-amplify/auth/server';

const publicRoutes = ['/', '/login'];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const response = NextResponse.next();

  const authenticated = await runWithAmplifyServerContext({
    nextServerContext: { request, response },
    operation: async (contextSpec) => {
      try {
        const session = await fetchAuthSession(contextSpec);
        return (
          session.tokens?.accessToken !== undefined &&
          session.tokens?.idToken !== undefined
        );
      } catch {
        return false;
      }
    },
  });

  const isPublicRoute = publicRoutes.includes(pathname);

  if (!isPublicRoute && !authenticated) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (isPublicRoute && authenticated) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return response;
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
