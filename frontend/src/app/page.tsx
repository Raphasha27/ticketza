
"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, ShieldCheck, Zap, BarChart3, Ticket } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" }
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 selection:bg-indigo-500/30 overflow-hidden">
      <Navbar />
      
      {/* Background Gradients */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-indigo-600/20 rounded-full blur-[120px] mix-blend-screen" />
        <div className="absolute bottom-[10%] right-[-5%] w-[400px] h-[400px] bg-pink-600/20 rounded-full blur-[120px] mix-blend-screen" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-4xl mx-auto"
        >
            <motion.div variants={itemVariants} className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8">
                <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                <span className="text-xs font-semibold tracking-wide text-green-400 uppercase">Live in South Africa</span>
            </motion.div>

            <motion.h1 variants={itemVariants} className="font-heading text-5xl md:text-7xl font-bold tracking-tight text-white mb-8 leading-tight">
              The Heartbeat of <br />
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-500 bg-clip-text text-transparent">African Events</span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-lg md:text-xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed">
              Experience the next generation of ticketing. Secure seats in real-time for the biggest concerts, matches, and festivals in Mzansi.
            </motion.p>

            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link href="/events/1">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="group relative inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-indigo-50 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.3)]"
                  >
                    Find an Event
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </motion.button>
              </Link>
              <Link href="/organizer/dashboard">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-transparent border border-white/20 text-white rounded-full font-bold text-lg hover:bg-white/5 transition-colors"
                  >
                    List Your Event
                  </motion.button>
              </Link>
            </motion.div>
        </motion.div>

        {/* Floating UI Elements (Parallax Illusion) */}
        <motion.div 
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 1 }}
            className="mt-20 relative mx-auto max-w-5xl"
        >
            <div className="relative z-10 bg-slate-800/50 backdrop-blur-xl border border-white/10 rounded-2xl p-4 shadow-2xl transform rotate-1 hover:rotate-0 transition-transform duration-500">
                <div className="aspect-[21/9] overflow-hidden rounded-lg relative">
                     {/* Placeholder for a cool event image collage */}
                     <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900 to-slate-900"></div>
                     <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-slate-600 font-bold text-4xl opacity-20">FEATURED EVENT PREVIEW</span>
                     </div>
                     {/* Mock Floating Ticket */}
                     <motion.div 
                        animate={{ y: [0, -15, 0] }}
                        transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
                        className="absolute right-10 top-10 bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-xl max-w-[200px]"
                     >
                        <div className="h-2 w-full bg-white/20 rounded mb-2"></div>
                        <div className="h-2 w-2/3 bg-white/20 rounded mb-4"></div>
                        <div className="flex justify-between items-center">
                            <div className="h-8 w-8 rounded bg-indigo-500 flex items-center justify-center">
                                <Ticket className="w-4 h-4 text-white" />
                            </div>
                            <div className="text-xs font-mono text-green-400">CONFIRMED</div>
                        </div>
                     </motion.div>
                </div>
            </div>
            
            {/* Glow under the image */}
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-pink-500 opacity-20 blur-2xl rounded-[3rem] -z-10"></div>
        </motion.div>
      </div>

      {/* Features Grid */}
      <section className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
                { icon: Zap, color: "text-amber-400", bg: "bg-amber-400/10", title: "Lightning Fast", desc: "Our real-time engine locks seats in milliseconds using Redis." },
                { icon: ShieldCheck, color: "text-green-400", bg: "bg-green-400/10", title: "Fraud Proof", desc: "Dynamic QR codes update every 60 seconds to prevent screenshots." },
                { icon: BarChart3, color: "text-purple-400", bg: "bg-purple-400/10", title: "Deep Analytics", desc: "Organizers get live heatmaps of seat occupancy and sales." }
             ].map((feature, i) => (
                 <motion.div 
                    key={i}
                    whileHover={{ y: -5 }}
                    className="p-8 rounded-3xl bg-slate-800/30 border border-white/5 hover:bg-slate-800/50 hover:border-white/10 transition-all cursor-default group"
                 >
                    <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className={`w-7 h-7 ${feature.color}`} />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3 font-heading">{feature.title}</h3>
                    <p className="text-slate-400 leading-relaxed">
                        {feature.desc}
                    </p>
                 </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* Footer Simple */}
      <footer className="border-t border-white/5 py-12 bg-slate-900/50">
          <div className="max-w-7xl mx-auto px-6 text-center text-slate-500 text-sm">
            <p>&copy; 2026 Ticketza South Africa. Built with 💜 by Antigravity.</p>
          </div>
      </footer>
    </main>
  );
}
