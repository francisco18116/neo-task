# NeoTask

Futuristic cyberpunk todo app. Next.js 16 + Supabase + Vercel.

## Stack
- **Framework:** Next.js 16 (App Router), TypeScript
- **Styling:** Tailwind CSS v4, Framer Motion
- **Backend:** Supabase (auth + postgres)
- **Deployment:** Vercel (auto-deploys on push to main)
- **Fonts:** Orbitron (headings/HUD), Space Grotesk (body)

## Supabase
- Project URL: https://cwmzzfzodfkrgutjdkdo.supabase.co
- Project ref: cwmzzfzodfkrgutjdkdo
- Credentials are in `.env.local` (gitignored)

## Key Files
- `proxy.ts` — auth route protection (Next.js 16 middleware)
- `lib/supabase/client.ts` — browser Supabase client
- `lib/supabase/server.ts` — server Supabase client (SSR)
- `lib/types.ts` — Todo type, Priority type, PRIORITY_CONFIG
- `components/Dashboard.tsx` — main client shell, holds todos state
- `app/dashboard/page.tsx` — server component, fetches initial todos
- `app/login/page.tsx` — auth page

## Database Schema
```sql
todos (id, user_id, title, completed, priority, created_at)
-- RLS enabled: users can only access their own todos
```

## Design System
- Background: `#06060f` (near black)
- Neon cyan: `#00f5ff` — primary accent
- Neon purple: `#bf00ff` — secondary
- Neon pink: `#ff006e` — danger/high priority
- Neon green: `#00ff88` — success/low priority
- CSS utilities: `.glass`, `.glow-cyan`, `.text-glow-cyan`, `.font-orbitron`, `.neon-input`

## Conventions
- All components use `'use client'` only when they need browser APIs or state
- Server components fetch data, pass it as props to client components
- Supabase queries in components use `createClient()` from `lib/supabase/client.ts`
- Never commit `.env.local`
- Always run `npm run build` before pushing

## Commands
```bash
npm run dev      # start dev server at localhost:3000
npm run build    # production build (run before pushing)
git add [files] && git commit -m "..." && git push  # deploy
```

## Git Workflow
- `main` branch → auto-deploys to Vercel production
- Feature branches → Vercel preview URL
- Always write descriptive commit messages
