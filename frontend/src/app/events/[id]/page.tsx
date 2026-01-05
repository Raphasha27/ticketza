
"use client";

import React, { useState, useEffect } from "react";
import Navbar from "@/components/Navbar";
import SeatMap from "@/components/seatmap/SeatMap";
import Link from "next/link";
// import { useParams } from "next/navigation";

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
  // In a real app, we would fetch event details via API
  // const { id } = params; 

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
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      <Navbar />

      {/* Hero Banner */}
      <div className="relative h-[40vh] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/60 to-transparent z-10" />
        <img 
            src={MOCK_EVENT.image} 
            alt={MOCK_EVENT.title} 
            className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 z-20 p-6 md:p-12 w-full max-w-7xl mx-auto">
            <span className="px-3 py-1 rounded-full bg-indigo-600/80 text-xs font-bold uppercase tracking-wide mb-4 inline-block backdrop-blur-sm">
                Sports
            </span>
            <h1 className="font-heading text-4xl md:text-6xl font-bold mb-2">{MOCK_EVENT.title}</h1>
            <div className="flex flex-wrap gap-4 text-slate-300 text-sm md:text-base">
                <span className="flex items-center gap-1">📅 {new Date(MOCK_EVENT.date).toLocaleDateString()}</span>
                <span className="flex items-center gap-1">📍 {MOCK_EVENT.venue}</span>
            </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-3 gap-12 mt-8">
        
        {/* Left: Seat Map */}
        <div className="lg:col-span-2">
            <div className="mb-6">
                <h2 className="text-2xl font-heading font-semibold mb-2">Select Your Seats</h2>
                <p className="text-slate-400">Click on available seats to add them to your cart.</p>
            </div>
            
            {/* The Seat Map Component */}
            <SeatMap 
                seats={MOCK_SEATS as any} 
                onSeatSelect={handleSeatSelect} 
                selectedSeats={selectedSeats}
            />
        </div>

        {/* Right: Checkout Sidebar */}
        <div className="lg:col-span-1">
            <div className="sticky top-24 glass-card p-6 border-t-4 border-indigo-500">
                <h3 className="text-xl font-bold mb-6 flex justify-between items-center">
                    Your Cart
                    <span className="text-sm font-normal text-slate-400">{selectedSeats.length} items</span>
                </h3>

                {selectedSeats.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 border-2 border-dashed border-slate-700/50 rounded-xl">
                        Select seats to proceed
                    </div>
                ) : (
                    <div className="space-y-4">
                        {selectedSeats.map(id => {
                            const seat = MOCK_SEATS.find(s => s.id === id);
                            if (!seat) return null;
                            return (
                                <div key={id} className="flex justify-between items-center bg-slate-800/50 p-3 rounded-lg">
                                    <div>
                                        <div className="text-sm font-semibold">Row {seat.row} - Seat {seat.number}</div>
                                        <div className="text-xs text-slate-400">Standard Ticket</div>
                                    </div>
                                    <div className="font-mono text-indigo-300">R{seat.price}</div>
                                </div>
                            )
                        })}
                        
                        <div className="border-t border-white/10 my-4 pt-4 flex justify-between items-center">
                            <span className="text-lg font-bold">Total</span>
                            <span className="text-2xl font-bold text-white">R{totalPrice}</span>
                        </div>

                        <Link href="/checkout/success">
                            <button className="w-full bg-gradient-to-r from-indigo-600 to-pink-600 hover:from-indigo-500 hover:to-pink-500 py-4 rounded-xl font-bold text-lg shadow-lg shadow-indigo-500/25 transition-all active:scale-95">
                                Checkout Now
                            </button>
                        </Link>
                        <p className="text-center text-xs text-slate-500">
                            Secured by PayFast
                        </p>
                    </div>
                )}
            </div>
        </div>

      </div>
    </main>
  );
}
