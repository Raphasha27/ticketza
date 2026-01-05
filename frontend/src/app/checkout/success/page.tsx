"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";
import { motion } from "framer-motion";
import { CheckCircle2, Download, Home, Calendar, MapPin } from "lucide-react";

// Represents what we would get from the backend API
const MOCK_TICKET = {
  id: "TCK-8X92Z",
  event: "Soweto Derby: Chiefs vs Pirates",
  venue: "FNB Stadium",
  seats: ["Row A - 12", "Row A - 13"],
  date: "20 Mar 2026, 15:00",
  qr_code: "https://api.qrserver.com/v1/create-qr-code/?size=280x280&data=Ticketza-TCK-8X92Z&bgcolor=1e293b&color=f8fafc",
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[20%] left-[-5%] w-[400px] h-[400px] bg-green-600/20 rounded-full blur-[120px]" />
        <div className="absolute bottom-[20%] right-[-5%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      <div className="pt-32 px-6 max-w-2xl mx-auto text-center relative z-10">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.6 }}
          className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-green-500/50"
        >
          <CheckCircle2 className="w-10 h-10 text-green-400" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-4xl font-heading font-bold mb-3 bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent"
        >
          Payment Successful!
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-slate-400 mb-12 text-lg"
        >
          Your seats are secured. Here is your digital ticket.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-3xl bg-gradient-to-br from-slate-800/80 to-slate-900/80 backdrop-blur-xl border border-white/10 p-0 overflow-hidden relative group shadow-2xl"
        >
          {/* Top colored bar */}
          <div className="h-2 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500"></div>
          
          <div className="p-8">
            {/* Event Info */}
            <div className="mb-6 pb-6 border-b border-white/10">
              <h2 className="text-2xl font-bold mb-3 text-white">{MOCK_TICKET.event}</h2>
              <div className="flex flex-col gap-2 text-slate-300 text-sm">
                <div className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4 text-indigo-400" />
                  <span>{MOCK_TICKET.venue}</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <Calendar className="w-4 h-4 text-indigo-400" />
                  <span>{MOCK_TICKET.date}</span>
                </div>
              </div>
            </div>

            {/* QR Code */}
            <motion.div 
              whileHover={{ scale: 1.05 }}
              className="bg-slate-700/30 backdrop-blur-sm p-6 rounded-2xl inline-block mb-6 border border-white/10 shadow-xl"
            >
               <img 
                 src={MOCK_TICKET.qr_code} 
                 alt="Ticket QR" 
                 className="w-64 h-64 mx-auto rounded-lg" 
               />
            </motion.div>

            {/* Ticket Details */}
            <div className="grid grid-cols-2 gap-4 text-left bg-slate-700/20 rounded-xl p-4 border border-white/5">
                <div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Reference</div>
                    <div className="font-mono text-indigo-400 font-semibold">{MOCK_TICKET.id}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider mb-1">Seats</div>
                    <div className="text-white font-semibold">{MOCK_TICKET.seats.join(", ")}</div>
                </div>
            </div>

            {/* Important Notice */}
            <div className="mt-6 p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl text-sm text-amber-200">
              <p className="font-semibold mb-1">📱 Save This Screen</p>
              <p className="text-xs text-amber-300/80">Present this QR code at the venue entrance. Screenshot or download for offline access.</p>
            </div>
          </div>
          
          {/* Decorative holes for ticket look */}
          <div className="absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0B0F19] rounded-full border-4 border-slate-800/50"></div>
          <div className="absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 bg-[#0B0F19] rounded-full border-4 border-slate-800/50"></div>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-10 flex flex-col sm:flex-row gap-4 justify-center"
        >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700/50 hover:bg-slate-700 border border-white/10 rounded-xl font-medium transition-all"
            >
                <Download className="w-4 h-4" />
                Download PDF
            </motion.button>
            <Link href="/">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center gap-2 px-6 py-3 bg-white/10 hover:bg-white/20 border border-white/10 rounded-xl font-medium transition-all"
                >
                    <Home className="w-4 h-4" />
                    Return to Home
                </motion.button>
            </Link>
        </motion.div>

      </div>
    </main>
  );
}
