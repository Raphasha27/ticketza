"use client";

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Menu, X, Zap } from 'lucide-react';
import { useState } from 'react';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 bg-slate-900/80 backdrop-blur-2xl border-b border-white/10 shadow-[0_10px_40px_rgba(0,0,0,0.3)]"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <motion.div 
              whileHover={{ rotate: 180, scale: 1.1 }}
              transition={{ duration: 0.4 }}
              className="w-12 h-12 bg-gradient-to-br from-cyan-400 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/50 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-white/20 group-hover:bg-white/30 transition-colors" />
              <Zap className="w-6 h-6 text-white relative z-10" strokeWidth={3} />
            </motion.div>
            <div>
              <span className="font-heading text-2xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent block leading-none">
                TICKETZA
              </span>
              <span className="text-[10px] text-slate-500 font-bold tracking-wider uppercase">Next-Gen Events</span>
            </div>
          </Link>
          
          {/* Desktop Menu */}
          <div className="hidden md:flex items-center space-x-2">
            <Link href="/events/1" className="group relative px-4 py-2 rounded-xl text-slate-300 hover:text-white transition-colors font-bold text-sm">
              <span className="relative z-10">Events</span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-colors" />
            </Link>
            <Link href="/organizer/dashboard" className="group relative px-4 py-2 rounded-xl text-slate-300 hover:text-white transition-colors font-bold text-sm">
              <span className="relative z-10">For Organizers</span>
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 rounded-xl transition-colors" />
            </Link>
            
            {/* CTA Button */}
            <motion.div 
              whileHover={{ scale: 1.05 }} 
              whileTap={{ scale: 0.95 }}
              className="ml-4"
            >
              <Link href="#" className="relative inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white rounded-xl font-bold text-sm shadow-lg shadow-cyan-500/30 overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                <span className="relative z-10">Sign In</span>
                <div className="w-1.5 h-1.5 rounded-full bg-white/80 animate-pulse relative z-10" />
              </Link>
            </motion.div>

            {/* Admin Secret */}
            <Link href="/admin/dashboard" className="ml-2 text-slate-700 hover:text-cyan-400 transition-colors text-xs" title="Admin Portal">
              🦄
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-xl transition-all"
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
          className="md:hidden bg-slate-900/95 backdrop-blur-2xl border-t border-white/10"
        >
          <div className="px-4 pt-3 pb-4 space-y-2">
            <Link href="/events/1" className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 font-bold transition-all">
              Events
            </Link>
            <Link href="/organizer/dashboard" className="block px-4 py-3 rounded-xl text-slate-300 hover:text-white hover:bg-white/10 font-bold transition-all">
              For Organizers
            </Link>
            <Link href="#" className="block px-4 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold text-center shadow-lg shadow-cyan-500/30 mt-3">
              Sign In
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
