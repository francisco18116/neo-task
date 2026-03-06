import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');

  if (!code) {
    return NextResponse.redirect(`${origin}/dashboard?error=google_auth_failed`);
  }

  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      redirect_uri: `${process.env.NEXT_PUBLIC_APP_URL}/api/google/callback`,
      grant_type: 'authorization_code',
    }),
  });

  if (!tokenRes.ok) {
    return NextResponse.redirect(`${origin}/dashboard?error=token_exchange_failed`);
  }

  const { access_token, refresh_token, expires_in } = await tokenRes.json();
  const expires_at = new Date(Date.now() + expires_in * 1000).toISOString();

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.redirect(`${origin}/login`);
  }

  await supabase.from('google_tokens').upsert(
    { user_id: user.id, access_token, refresh_token, expires_at },
    { onConflict: 'user_id' }
  );

  return NextResponse.redirect(`${origin}/dashboard?tab=calendar`);
}
