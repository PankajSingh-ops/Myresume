import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const PUBLIC_PATHS = [
    '/',
    '/login',
    '/register',
    '/verify-email',
    '/forgot-password',
    '/reset-password',
    '/privacy',
    '/terms',
    '/contact',
    '/help',
    '/cookies',
    '/faq',
    '/plans',
    '/templates',
    '/cover-templates',
    '/ats',
];

function isPublicPath(pathname: string): boolean {
    if (PUBLIC_PATHS.includes(pathname)) return true;
    if (pathname.startsWith('/r/')) return true;
    if (pathname.startsWith('/c/')) return true;
    if (pathname.startsWith('/blog')) return true;
    if (pathname.startsWith('/resume-render/')) return true;
    if (pathname.startsWith('/cover-letter-render/')) return true;
    // Static / internal Next.js paths
    if (pathname.startsWith('/_next')) return true;
    if (pathname.startsWith('/api')) return true;
    if (pathname.includes('.')) return true; // static files
    return false;
}

export async function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;

    if (isPublicPath(pathname)) {
        return NextResponse.next();
    }

    // Protected route — check for access_token cookie
    const token = request.cookies.get('access_token')?.value;

    if (!token) {
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', encodeURIComponent(pathname));
        return NextResponse.redirect(loginUrl);
    }

    try {
        const secret = new TextEncoder().encode(
            process.env.JWT_ACCESS_SECRET || '',
        );
        await jwtVerify(token, secret);
        return NextResponse.next();
    } catch {
        // Token invalid or expired — redirect to login
        const loginUrl = new URL('/login', request.url);
        loginUrl.searchParams.set('redirect', encodeURIComponent(pathname));
        return NextResponse.redirect(loginUrl);
    }
}

export const config = {
    matcher: [
        /*
         * Match all paths except static files and Next.js internals.
         * The proxy function itself does fine-grained filtering.
         */
        '/((?!_next/static|_next/image|favicon.ico|.*\\.).*)',
    ],
};
