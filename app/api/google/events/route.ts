import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function refreshAccessToken(
  refreshToken: string
): Promise<{ access_token: string; expires_at: string } | null> {
  const res = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_id: process.env.GOOGLE_CLIENT_ID!,
      client_secret: process.env.GOOGLE_CLIENT_SECRET!,
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!res.ok) return null;

  const { access_token, expires_in } = await res.json();
  return {
    access_token,
    expires_at: new Date(Date.now() + expires_in * 1000).toISOString(),
  };
}

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const year = parseInt(searchParams.get('year') ?? String(new Date().getFullYear()));
  const month = parseInt(searchParams.get('month') ?? String(new Date().getMonth() + 1));

  const { data: tokenRow } = await supabase
    .from('google_tokens')
    .select('*')
    .eq('user_id', user.id)
    .single();

  if (!tokenRow) {
    return NextResponse.json({ error: 'Not connected' }, { status: 401 });
  }

  let { access_token, refresh_token, expires_at } = tokenRow;

  // Refresh if token expires within 60 seconds
  if (new Date(expires_at).getTime() < Date.now() + 60_000) {
    const refreshed = await refreshAccessToken(refresh_token);
    if (!refreshed) {
      await supabase.from('google_tokens').delete().eq('user_id', user.id);
      return NextResponse.json({ error: 'Token expired' }, { status: 401 });
    }
    access_token = refreshed.access_token;
    await supabase
      .from('google_tokens')
      .update({ access_token: refreshed.access_token, expires_at: refreshed.expires_at })
      .eq('user_id', user.id);
  }

  const timeMin = new Date(year, month - 1, 1).toISOString();
  const timeMax = new Date(year, month, 0, 23, 59, 59).toISOString();

  const calRes = await fetch(
    `https://www.googleapis.com/calendar/v3/calendars/primary/events?` +
      new URLSearchParams({
        timeMin,
        timeMax,
        singleEvents: 'true',
        orderBy: 'startTime',
        maxResults: '100',
      }),
    { headers: { Authorization: `Bearer ${access_token}` } }
  );

  if (!calRes.ok) {
    return NextResponse.json({ error: 'Google API error' }, { status: 502 });
  }

  const { items } = await calRes.json();

  return NextResponse.json({
    events: (items ?? []).map((ev: Record<string, unknown>) => ({
      id: ev.id,
      summary: ev.summary ?? '(No title)',
      start: ev.start,
      end: ev.end,
      colorId: ev.colorId,
    })),
  });
}
