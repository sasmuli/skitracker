import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { createServerClient, type CookieOptions } from '@supabase/ssr';

type CookieToSet = {
  name: string;
  value: string;
  options?: CookieOptions;
};

const SITE_PASSWORD = process.env.SITE_PASSWORD;
const PASSWORD_COOKIE_NAME = 'site-access';

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Password protection (skip if no password is set)
  if (SITE_PASSWORD) {
    const isPublicPath =
      pathname.startsWith('/_next') ||
      pathname.startsWith('/api') ||
      pathname.startsWith('/favicon') ||
      pathname.endsWith('.png') ||
      pathname.endsWith('.ico') ||
      pathname === '/site-password';

    if (!isPublicPath) {
      const accessCookie = request.cookies.get(PASSWORD_COOKIE_NAME);
      if (accessCookie?.value !== SITE_PASSWORD) {
        const url = request.nextUrl.clone();
        url.pathname = '/site-password';
        url.searchParams.set('redirect', pathname);
        return NextResponse.redirect(url);
      }
    }
  }

  let supabaseResponse = NextResponse.next({ request });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet: CookieToSet[]) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          supabaseResponse = NextResponse.next({ request });

          cookiesToSet.forEach(({ name, value, options }) => {
            supabaseResponse.cookies.set(name, value, options);
          });
        },
      },
    }
  );

  await supabase.auth.getUser();

  return supabaseResponse;
}
