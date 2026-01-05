"use client";

import Image from "next/image";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, MapPin, ShieldCheck, Zap, BarChart3, Ticket, Sparkles, Trophy, Heart, Music, Users, Smartphone, Globe, Lock } from "lucide-react";
import Link from "next/link";

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.2
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] }
  }
};

const floatingVariants = {
  animate: {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  }
};

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-slate-100 selection:bg-cyan-500/30 overflow-hidden relative">
      <Navbar />
      
      {/* Animated Gradient Mesh Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {/* Gradient Orbs */}
        <motion.div 
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-gradient-to-br from-cyan-500 to-blue-600 rounded-full blur-[120px] opacity-30" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.3, 1],
            opacity: [0.3, 0.5, 0.3]
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600 to-pink-600 rounded-full blur-[120px] opacity-30" 
        />
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.2, 0.4, 0.2]
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-1/3 left-1/2 w-[400px] h-[400px] bg-gradient-to-bl from-indigo-600 to-purple-600 rounded-full blur-[100px] opacity-20" 
        />
        
        {/* Grid Pattern Overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(99,102,241,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.03)_1px,transparent_1px)] bg-[size:50px_50px]" />
      </div>

      {/* Hero Section */}
      <div className="relative z-10 pt-32 pb-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <motion.div 
            initial="hidden"
            animate="visible"
            variants={containerVariants}
            className="text-center max-w-6xl mx-auto"
        >
            {/* Tech Badge */}
            <motion.div 
              variants={itemVariants} 
              className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 backdrop-blur-xl mb-8 shadow-[0_0_30px_rgba(6,182,212,0.3)] group hover:shadow-[0_0_50px_rgba(6,182,212,0.5)] transition-all cursor-default"
            >
                <span className="flex h-2.5 w-2.5 rounded-full bg-gradient-to-r from-cyan-400 to-blue-400 animate-pulse shadow-[0_0_10px_rgba(6,182,212,0.8)]"></span>
                <Sparkles className="w-5 h-5 text-cyan-400" />
                <span className="text-sm font-bold tracking-wide text-cyan-300 uppercase">Powered by AI & Real-Time Tech</span>
                <div className="h-4 w-px bg-cyan-500/30"></div>
                <Globe className="w-4 h-4 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={itemVariants} 
              className="font-heading text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8 leading-[0.95]"
            >
              <span className="block text-white">The Future of</span>
              <span className="block mt-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-600 bg-clip-text text-transparent relative">
                Live Events
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-purple-500/20 blur-3xl -z-10"
                  animate={{ opacity: [0.5, 0.8, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
              </span>
            </motion.h1>

            <motion.p 
              variants={itemVariants} 
              className="text-xl md:text-2xl text-slate-400 mb-14 max-w-3xl mx-auto leading-relaxed font-medium"
            >
              Experience <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500 font-bold">next-generation ticketing</span> with 
              real-time seat selection, blockchain verification, and instant digital access.
            </motion.p>

            {/* CTA Buttons */}
            <motion.div 
              variants={itemVariants} 
              className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-20"
            >
              <Link href="/events/1">
                  <motion.button 
                    whileHover={{ scale: 1.05, boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.5)" }}
                    whileTap={{ scale: 0.98 }}
                    className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-2xl font-bold text-lg shadow-[0_10px_40px_rgba(6,182,212,0.3)] transition-all overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                    <Ticket className="w-6 h-6 relative z-10" />
                    <span className="relative z-10">Explore Events</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                  </motion.button>
              </Link>
              <Link href="/organizer/dashboard">
                  <motion.button 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white/10 border-2 border-white/20 text-white rounded-2xl font-bold text-lg hover:bg-white/20 backdrop-blur-xl transition-all"
                  >
                    <Trophy className="w-5 h-5 text-yellow-400" />
                    For Organizers
                  </motion.button>
              </Link>
            </motion.div>

            {/* Floating Tech Cards */}
            <motion.div 
              initial={{ opacity: 0, y: 60 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 1 }}
              className="relative"
            >
              {/* Main Dashboard Preview */}
              <div className="relative rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border border-white/10 p-8 shadow-[0_20px_80px_rgba(0,0,0,0.5)] overflow-hidden">
                {/* Header Bar */}
                <div className="flex items-center gap-2 mb-6">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>

                {/* Content */}
                <div className="grid grid-cols-3 gap-6 mb-6">
                  {[
                    { label: "Active Events", value: "2.4K", color: "from-cyan-400 to-blue-500" },
                    { label: "Tickets Sold", value: "1.2M", color: "from-purple-400 to-pink-500" },
                    { label: "Success Rate", value: "99.9%", color: "from-green-400 to-emerald-500" }
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 1 + (i * 0.1) }}
                      className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm"
                    >
                      <div className="text-slate-400 text-xs font-medium mb-1">{stat.label}</div>
                      <div className={`text-3xl font-black bg-gradient-to-r ${stat.color} bg-clip-text text-transparent`}>
                        {stat.value}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Mock Event Cards */}
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { emoji: "🎸", event: "Black Coffee Live", gradient: "from-orange-500 to-pink-500" },
                    { emoji: "⚽", event: "Soweto Derby", gradient: "from-green-500 to-emerald-600" }
                  ].map((item, i) => (
                    <motion.div
                      key={i}
                      variants={floatingVariants}
                      animate="animate"
                      transition={{ delay: i * 0.3 }}
                      className={`p-4 rounded-xl bg-gradient-to-br ${item.gradient} bg-opacity-20 border border-white/20`}
                    >
                      <div className="text-2xl mb-2">{item.emoji}</div>
                      <div className="text-sm font-bold text-white">{item.event}</div>
                      <div className="text-xs text-white/70 mt-1">Live Now</div>
                    </motion.div>
                  ))}
                </div>

                {/* Glow Effect */}
                <div className="absolute -inset-px bg-gradient-to-r from-cyan-500/20 via-purple-500/20 to-pink-500/20 rounded-3xl blur-2xl -z-10 opacity-50" />
              </div>

              {/* Floating Status Cards */}
              <motion.div 
                variants={floatingVariants}
                animate="animate"
                className="absolute -top-6 -right-6 px-4 py-3 rounded-xl bg-gradient-to-r from-green-500/90 to-emerald-600/90 backdrop-blur-xl border border-green-400/50 shadow-[0_10px_40px_rgba(34,197,94,0.4)]"
              >
                <div className="flex items-center gap-2">
                  <Lock className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">Secured by Blockchain</span>
                </div>
              </motion.div>

              <motion.div 
                variants={floatingVariants}
                animate="animate"
                transition={{ delay: 0.5 }}
                className="absolute -bottom-4 -left-6 px-4 py-3 rounded-xl bg-gradient-to-r from-purple-500/90 to-pink-600/90 backdrop-blur-xl border border-purple-400/50 shadow-[0_10px_40px_rgba(168,85,247,0.4)]"
              >
                <div className="flex items-center gap-2">
                  <Smartphone className="w-4 h-4 text-white" />
                  <span className="text-sm font-bold text-white">Instant Mobile Access</span>
                </div>
              </motion.div>
            </motion.div>
        </motion.div>
      </div>

      {/* Features Section */}
      <section className="py-32 relative z-10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-20"
          >
            <h2 className="text-5xl md:text-6xl font-heading font-black mb-6 bg-gradient-to-r from-white to-slate-400 bg-clip-text text-transparent">
              Built for the Modern Era
            </h2>
            <p className="text-slate-400 text-xl max-w-2xl mx-auto font-medium">
              Cutting-edge technology meets seamless user experience
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {[
                { 
                  icon: Zap, 
                  gradient: "from-yellow-400 to-orange-500", 
                  title: "Real-Time Sync", 
                  desc: "Powered by WebSocket technology for instant seat updates across all devices simultaneously."
                },
                { 
                  icon: ShieldCheck, 
                  gradient: "from-cyan-400 to-blue-500", 
                  title: "Zero-Trust Security", 
                  desc: "End-to-end encryption with dynamic QR codes that refresh every 30 seconds."
                },
                { 
                  icon: BarChart3, 
                  gradient: "from-purple-400 to-pink-500", 
                  title: "AI Analytics", 
                  desc: "Machine learning algorithms predict demand and optimize pricing in real-time."
                }
             ].map((feature, i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.15, duration: 0.6 }}
                    whileHover={{ y: -12, scale: 1.02 }}
                    className="group p-8 rounded-3xl bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-white/10 backdrop-blur-xl hover:border-white/20 transition-all cursor-default relative overflow-hidden"
                 >
                    {/* Hover Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                    
                    {/* Icon */}
                    <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-[0_10px_40px_rgba(0,0,0,0.3)] group-hover:scale-110 transition-transform duration-300`}>
                        <feature.icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                        <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${feature.gradient} blur-xl opacity-50`} />
                    </div>
                    
                    <h3 className="text-2xl font-black text-white mb-4 font-heading">
                      {feature.title}
                    </h3>
                    <p className="text-slate-400 leading-relaxed font-medium">
                        {feature.desc}
                    </p>

                    {/* Corner Accent */}
                    <div className={`absolute top-0 right-0 w-20 h-20 bg-gradient-to-br ${feature.gradient} opacity-10 rounded-bl-3xl`} />
                 </motion.div>
             ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-10">
        <div className="max-w-5xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative p-16 rounded-[3rem] bg-gradient-to-br from-cyan-500/20 via-purple-500/20 to-pink-500/20 border border-white/20 backdrop-blur-2xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.5)]"
          >
            {/* Animated Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 via-purple-500/10 to-pink-500/10">
              <motion.div
                animate={{ 
                  backgroundPosition: ['0% 0%', '100% 100%'],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-[linear-gradient(45deg,transparent_25%,rgba(6,182,212,0.1)_50%,transparent_75%)] bg-[length:250%_250%]"
              />
            </div>

            <div className="relative z-10 text-center">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-r from-cyan-400 to-purple-600 flex items-center justify-center"
              >
                <Sparkles className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-5xl md:text-6xl font-black mb-6 bg-gradient-to-r from-white via-cyan-200 to-white bg-clip-text text-transparent">
                Ready for the Future?
              </h3>
              <p className="text-slate-300 mb-10 text-xl font-medium max-w-2xl mx-auto">
                Join <span className="text-cyan-400 font-bold">50,000+</span> South Africans already experiencing the next generation of live events
              </p>
              <Link href="/events/1">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-12 py-6 bg-white text-slate-900 rounded-2xl font-black text-xl shadow-[0_20px_60px_rgba(255,255,255,0.3)] hover:shadow-[0_25px_70px_rgba(255,255,255,0.4)] transition-all"
                >
                  Start Exploring
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 border-t border-white/10 bg-slate-900/50 backdrop-blur-xl relative z-10">
          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
              <div>
                <div className="font-heading text-3xl font-black bg-gradient-to-r from-cyan-400 to-purple-600 bg-clip-text text-transparent mb-2">
                  TICKETZA
                </div>
                <p className="text-slate-500 text-sm">Powered by Next-Gen Technology</p>
              </div>
              <div className="flex gap-8 text-sm text-slate-400">
                <a href="#" className="hover:text-cyan-400 transition-colors">Technology</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Security</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">API</a>
                <a href="#" className="hover:text-cyan-400 transition-colors">Developers</a>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-white/10 text-center text-slate-500 text-sm">
              &copy; 2026 Ticketza • Built with FastAPI, Next.js 16 & PostgreSQL • Blockchain Verified
            </div>
          </div>
      </footer>
    </main>
  );
}
