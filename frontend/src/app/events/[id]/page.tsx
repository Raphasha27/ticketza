"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SeatMap from "@/components/seatmap/SeatMap";
import Link from "next/link";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Trash2, ShoppingCart } from "lucide-react";

// Mock Data for demonstration since DB might be offline
const MOCK_EVENT = {
  id: 1,
  title: "Soweto Derby: Chiefs vs Pirates",
  description: "The biggest football rivalry in South Africa returns to the Calabash! Experience the atmosphere live.",
  date: "2026-03-20T15:00:00",
  venue: "FNB Stadium",
  image: "https://placehold.co/1200x400/orange/white?text=Soweto+Derby+Main",
};

const MOCK_SEATS = [
  ...Array.from({ length: 15 }, (_, i) => ({ id: i + 1, row: "A", number: `${i + 1}`, status: "AVAILABLE", price: 500 })),
  ...Array.from({ length: 15 }, (_, i) => ({ id: i + 20, row: "B", number: `${i + 1}`, status: i === 5 ? "SOLD" : "AVAILABLE", price: 500 })),
  ...Array.from({ length: 15 }, (_, i) => ({ id: i + 40, row: "C", number: `${i + 1}`, status: i > 10 ? "LOCKED" : "AVAILABLE", price: 350 })),
  ...Array.from({ length: 15 }, (_, i) => ({ id: i + 60, row: "D", number: `${i + 1}`, status: "AVAILABLE", price: 350 })),
];

export default function EventPage({ params }: { params: { id: string } }) {
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);

  const handleSeatSelect = (seat: any) => {
    if (selectedSeats.includes(seat.id)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seat.id));
    } else {
      setSelectedSeats([...selectedSeats, seat.id]);
    }
  };

  const totalPrice = selectedSeats.reduce((sum, id) => {
    const seat = MOCK_SEATS.find(s => s.id === id);
    return sum + (seat ? seat.price : 0);
  }, 0);

  return (
    <main className="min-h-screen bg-[#0B0F19] text-slate-100 pb-20 relative overflow-hidden">
      {/* Background Effects */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-5%] right-[-10%] w-[400px] h-[400px] bg-indigo-600/20 rounded-full blur-[120px]" />
      </div>

      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19] via-[#0B0F19]/80 to-transparent z-10" />
        <img 
            src={MOCK_EVENT.image} 
            alt={MOCK_EVENT.title} 
            className="w-full h-full object-cover opacity-60"
        />
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="absolute bottom-0 left-0 z-20 p-6 md:p-12 w-full max-w-7xl mx-auto"
        >
            <motion.span 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="px-3 py-1 rounded-full bg-orange-600/80 text-white text-xs font-bold uppercase tracking-wide mb-4 inline-block backdrop-blur-sm border border-orange-400/30"
            >
                Sports
            </motion.span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-3 text-white drop-shadow-2xl">{MOCK_EVENT.title}</h1>
            <div className="flex flex-wrap gap-4 text-slate-200 text-sm md:text-base">
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <Calendar className="w-4 h-4" />
                  {new Date(MOCK_EVENT.date).toLocaleDateString('en-ZA', { month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <Clock className="w-4 h-4" />
                  {new Date(MOCK_EVENT.date).toLocaleTimeString('en-ZA', { hour: '2-digit', minute: '2-digit' })}
                </span>
                <span className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/10">
                  <MapPin className="w-4 h-4" />
                  {MOCK_EVENT.venue}
                </span>
            </div>
        </motion.div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8 relative z-10">
        
        {/* Left: Seat Map */}
        <motion.div 
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="lg:col-span-2"
        >
            <div className="mb-6">
                <h2 className="text-2xl font-heading font-semibold mb-2 text-white">Select Your Seats</h2>
                <p className="text-slate-400">Click on available seats to add them to your cart.</p>
            </div>
            
            {/* The Seat Map Component */}
            <SeatMap 
                seats={MOCK_SEATS as any} 
                onSeatSelect={handleSeatSelect} 
                selectedSeats={selectedSeats}
            />
        </motion.div>

        {/* Right: Checkout Sidebar */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="lg:col-span-1"
        >
            <div className="sticky top-24 rounded-3xl bg-slate-800/50 border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-indigo-600/20 to-pink-600/20 border-b border-white/10 p-6">
                    <h3 className="text-xl font-bold flex justify-between items-center text-white">
                        <span className="flex items-center gap-2">
                          <ShoppingCart className="w-5 h-5" />
                          Your Cart
                        </span>
                        <span className="text-sm font-normal text-slate-300 bg-white/10 px-3 py-1 rounded-full">
                          {selectedSeats.length} {selectedSeats.length === 1 ? 'item' : 'items'}
                        </span>
                    </h3>
                </div>

                <div className="p-6">
                    {selectedSeats.length === 0 ? (
                        <div className="text-center py-16 text-slate-500 border-2 border-dashed border-slate-700/50 rounded-xl">
                            <ShoppingCart className="w-12 h-12 mx-auto mb-3 opacity-30" />
                            <p className="text-sm">Select seats to proceed</p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {selectedSeats.map(id => {
                                const seat = MOCK_SEATS.find(s => s.id === id);
                                if (!seat) return null;
                                return (
                                    <motion.div 
                                      key={id}
                                      initial={{ opacity: 0, scale: 0.9 }}
                                      animate={{ opacity: 1, scale: 1 }}
                                      exit={{ opacity: 0, scale: 0.9 }}
                                      className="flex justify-between items-center bg-slate-700/50 hover:bg-slate-700/70 p-4 rounded-xl border border-white/5 transition-colors group"
                                    >
                                        <div>
                                            <div className="text-sm font-semibold text-white">Row {seat.row} - Seat {seat.number}</div>
                                            <div className="text-xs text-slate-400">Standard Ticket</div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="font-mono text-indigo-300 font-bold">R{seat.price}</div>
                                            <button 
                                              onClick={() => handleSeatSelect(seat)}
                                              className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400 hover:text-red-300"
                                            >
                                              <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )
                            })}
                            
                            <div className="border-t border-white/10 my-4 pt-4 flex justify-between items-center">
                                <span className="text-lg font-bold text-white">Total</span>
                                <span className="text-3xl font-bold bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
                                  R{totalPrice.toLocaleString()}
                                </span>
                            </div>

                            <Link href="/checkout/success">
                                <motion.button 
                                  whileHover={{ scale: 1.02 }}
                                  whileTap={{ scale: 0.98 }}
                                  className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all"
                                >
                                    Checkout Now
                                </motion.button>
                            </Link>
                            <p className="text-center text-xs text-slate-500 mt-3">
                                🔒 Secured by PayFast
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </motion.div>

      </div>
    </main>
  );
}
