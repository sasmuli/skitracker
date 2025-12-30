import { NextResponse } from 'next/server';

const SITE_PASSWORD = process.env.SITE_PASSWORD;
const PASSWORD_COOKIE_NAME = 'site-access';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!SITE_PASSWORD) {
    return NextResponse.json({ error: 'No password configured' }, { status: 500 });
  }

  if (password === SITE_PASSWORD) {
    const response = NextResponse.json({ success: true });
    response.cookies.set(PASSWORD_COOKIE_NAME, SITE_PASSWORD, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 days
      path: '/',
    });
    return response;
  }

  return NextResponse.json({ error: 'Incorrect password' }, { status: 401 });
}
