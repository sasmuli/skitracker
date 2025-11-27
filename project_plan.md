1. Tech stack proposal

Frontend + backend framework

Next.js (App Router)

Great for responsive websites + SEO.

Server Components + Server Actions simplify data fetching and mutations.

Auth + database

Supabase

Email/password + magic link + OAuth if you want.

Postgres DB + Row Level Security (RLS).

You already know/like it from your other work, so low friction.

UI & state

Tailwind CSS for responsive layouts.

You can rely mostly on server components + server actions, plus a bit of client state (for modals).

2. User model & access concept

You want:

Each person (you, family, friends) to have their own account.

Each account can:

Log their own ski days.

See their own stats.

Optionally:

Join groups (e.g. “Family winter 24/25”) and see group stats / comparisons.

So, conceptually:

Every user can use the app individually.

Groups are optional but powerful for “family/friends using it together”.

3. Database schema
3.1 Tables
profiles

One row per Supabase user.

create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz default now()
);

seasons

Optional but useful for organizing by winter.

create table seasons (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  name text not null,                    -- e.g. "Winter 2024–2025"
  start_date date not null,              -- e.g. 2024-11-01
  end_date date not null,                -- e.g. 2025-04-30
  created_at timestamptz default now()
);

ski_days
create table ski_days (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  season_id uuid references seasons(id),
  date date not null,
  resort text,
  hours numeric,
  distance_km numeric,
  rating int,                            -- 1–5
  notes text,
  created_at timestamptz default now(),
  unique (user_id, date)                 -- one entry per day per user
);

groups (for family/friends)
create table groups (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references profiles(id) on delete cascade,
  name text not null,                    -- "Family", "Friends ski gang"
  invite_code text unique,               -- optional: simple join link
  created_at timestamptz default now()
);

group_members
create table group_members (
  group_id uuid references groups(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  role text default 'member',            -- 'owner', 'member'
  primary key (group_id, user_id)
);


You do not need to attach group_id to ski_days immediately. You can compute group stats as “all ski_days where user_id is in this group”.

4. Security (RLS policies idea)

On ski_days, enable RLS and add:

Policy: logged-in user can select only rows where user_id = auth.uid().

Policy: logged-in user can insert/update/delete only rows where user_id = auth.uid().

That way:

Each person sees only their own days.

Group views will pull multiple users’ data, but always via server-side code where you control the query (and still respect RLS).

5. App pages & flows
5.1 Routes

/ – Landing page

App description.

“Log in / Sign up” buttons.

/app – Main app shell (protected)

Redirects to /app/calendar by default.

/app/calendar

Calendar of the current season.

Click/tap a day → open a modal to log / edit a ski day.

/app/stats

Personal stats for selected season.

Switch season via dropdown.

/app/groups

List of groups user belongs to.

Create group, join via invite code.

/app/groups/[groupId]

Group dashboard:

Total ski days per person.

Leaderboard (days, hours, distance).

Option to filter by season.

/auth/* (Supabase UI or custom pages)

Sign in / Sign up / Password reset, etc.

6. UI: responsive layout concept

App shell layout

Mobile:

Header with season selector and profile icon.

Screen content.

Bottom tab bar: [Calendar] [Stats] [Groups] [Settings/Profile].

Desktop:

Left: side navigation.

Main: content (calendar or stats).

Stats can be visible beside calendar on wider screens.

Example structure with Tailwind:

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800">
        {/* logo, season dropdown, profile button */}
      </header>

      <main className="flex-1 container mx-auto px-4 py-4">
        {children}
      </main>

      {/* Mobile bottom nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 border-t border-slate-800 bg-slate-900/95 backdrop-blur">
        {/* icons/links for /app/calendar, /app/stats, /app/groups, /app/profile */}
      </nav>
    </div>
  );
}

7. Calendar & logging flow

User logs in → redirect to /app/calendar.

SeasonCalendar fetches ski_days for:

current user

current season (based on date or selection)

For each day:

If a ski_day exists → highlight day with a color / dot.

Click a day:

SkiDayModal opens.

If existing record → fields prefilled (edit mode).

On submit:

Call a server action or API route.

Upsert row in ski_days.

After save:

Rerender calendar (via revalidation or refetch).

Stats page will update accordingly.

8. Group stats example

On /app/groups/[groupId]:

Check the user is member of group.

Query:

group_members for that group → get user IDs.

ski_days for those users in a given season.

Aggregate on the server:

ski_days per user

total hours per user

total distance per user

Return data to a React Server Component that renders a leaderboard + charts.

This gives a fun “family/friends challenge” element:

Who has the most days?

Who skied the longest total time?

Who has the longest streak?

9. Suggested implementation order

Set up Next.js + Supabase:

Auth working.

profiles and ski_days tables.

Basic RLS.

Protected app shell (/app):

Simple “You must be logged in” redirect.

Layout + basic navigation.

Calendar + ski_days CRUD:

Local date-based calendar.

Modal form to create/edit ski_days.

Save via server actions or API.

Stats page (personal):

Compute total days, hours, distance.

Display as simple cards first, charts later.

Groups:

groups & group_members tables.

Create/join group.

Group stats page.