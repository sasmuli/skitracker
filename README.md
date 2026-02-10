https://skitracker.vercel.app/

# Ski Tracker

This is a **personal side project** for tracking ski days for myself, family and friends.

The long‑term idea is:

- Each person has their own account.
- You can log ski days (date, resort, hours, distance, rating, notes).
- Later: seasons, stats, and optional groups ("family", "friends gang") with shared leaderboards.

Right now the app has a **basic auth flow** and a **simple dashboard**, and I’ll grow it feature by feature.

For a more detailed concept (DB schema, pages, future features), see:

- [`project_plan.md`](./project_plan.md)

---

## Tech stack

- **Framework**: Next.js (App Router, TypeScript)
- **Auth & DB**: Supabase (`@supabase/supabase-js`, `@supabase/ssr`)
- **Styling**: TailwindCSS
- **Icons**: `lucide-react`

---

## Current app

At the moment the app has:

- A landing page at `/` with a shared header.
- Login and signup with Supabase email/password.
- A small onboarding step to set display name + avatar color.
- A protected `/app` dashboard that you only see when logged in.


---

## Development

Install dependencies:

```bash
npm install
```

Run the development server:

```bash
npm run dev
```

Then open [http://localhost:3000](http://localhost:3000) in your browser.

Type checking / linting:

```bash
npm run lint
```

Build for production:

```bash
npm run build
```
