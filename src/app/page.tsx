import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-4">Welcome Samuli</h1>
      <p className="text-slate-400 mb-6">Track your ski adventures</p>
      <Link
        href="/login"
        className="px-6 py-2 bg-blue-600 hover:bg-blue-500 rounded-lg"
      >
        Get Started
      </Link>
    </div>
  );
}
