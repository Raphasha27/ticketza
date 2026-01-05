"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-900/80 backdrop-blur-xl"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="font-heading text-2xl font-bold bg-gradient-to-r from-indigo-400 to-pink-500 bg-clip-text text-transparent hover:from-indigo-300 hover:to-pink-400 transition-all">
              Ticketza
            </Link>
          </div>
          
          {/* Desktop Menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link href="/events/1" className="group relative hover:text-white text-slate-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                Browse Events
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link href="/organizer/dashboard" className="group relative hover:text-white text-slate-300 px-3 py-2 rounded-md text-sm font-medium transition-colors">
                For Organizers
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-indigo-400 to-pink-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link href="#" className="bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white px-4 py-2 rounded-full text-sm font-medium transition-all shadow-lg shadow-indigo-500/25">
                  Sign In
                </Link>
              </motion.div>
              {/* Secret Admin Link for Demo */}
              <Link href="/admin/dashboard" className="text-xs text-slate-700 hover:text-red-500 transition-colors hover:scale-110 inline-block" title="Admin">
                🦄
              </Link>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-slate-300 hover:text-white p-2"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-slate-800/95 backdrop-blur-xl border-t border-white/5"
        >
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link href="/events/1" className="block hover:bg-white/5 text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors">
              Browse Events
            </Link>
            <Link href="/organizer/dashboard" className="block hover:bg-white/5 text-slate-300 hover:text-white px-3 py-2 rounded-md text-base font-medium transition-colors">
              For Organizers
            </Link>
            <Link href="#" className="block bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-2 rounded-md text-base font-medium transition-colors mt-2">
              Sign In
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
