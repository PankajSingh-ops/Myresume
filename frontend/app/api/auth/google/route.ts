import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const ref = searchParams.get('ref');

    const backendGoogleUrl = `${process.env.NEXT_PUBLIC_API_URL}/auth/google`;
    const response = NextResponse.redirect(backendGoogleUrl);

    // Set the pending_referral cookie so the backend can read it on OAuth callback
    if (ref) {
        response.cookies.set('pending_referral', ref, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'lax',
            maxAge: 600, // 10 minutes
            path: '/',
        });
    }

    return response;
}
