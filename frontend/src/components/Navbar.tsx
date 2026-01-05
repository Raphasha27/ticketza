
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-heading text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent">
              Ticketza
            </Link>
          </div>
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/events" className="hover:text-white text-slate-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Browse Events
              </Link>
              <Link href="/organizer/dashboard" className="hover:text-white text-slate-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                For Organizers
              </Link>
              <Link href="#" className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors">
                Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
