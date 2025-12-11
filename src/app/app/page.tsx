import Link from 'next/link';

export default function AppHome() {
  return (
    <div className="p-6 space-y-4">
      <h1 className="text-xl font-semibold">Welcome to Ski Tracker</h1>
      <p>Your journey starts here.</p>

      {/* CTA button */}
      <Link
        href="/app/add-day"
        className="inline-block px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md text-sm font-medium"
      >
        Add Ski Day
      </Link>

      <p className="text-sm text-slate-400">
        This is your dashboard.
      </p>
    </div>
  );
}
