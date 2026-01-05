
"use client";

import Navbar from "@/components/Navbar";
import React, { useState } from 'react';

export default function CreateEventPage() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
        setLoading(false);
        alert("Event Created Successfully! (Demo)");
    }, 1500);
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      <Navbar />

      <div className="max-w-3xl mx-auto px-6 pt-32">
        <h1 className="text-3xl font-heading font-bold mb-2">Create New Event</h1>
        <p className="text-slate-400 mb-8">Fill in the details to launch your event on Ticketza.</p>

        <form onSubmit={handleSubmit} className="glass-card bg-slate-800/50 p-8 space-y-6">
            
            {/* Essential Info */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="col-span-2">
                    <label className="block text-sm font-medium text-slate-300 mb-2">Event Title</label>
                    <input type="text" placeholder="e.g. Cape Town Jazz Festival" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" required />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Date</label>
                    <input type="date" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" required />
                </div>

                <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Time</label>
                    <input type="time" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" required />
                </div>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Venue</label>
                <select className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors">
                    <option>Select a Venue...</option>
                    <option>FNB Stadium (JHB)</option>
                    <option>Moses Mabhida (DBN)</option>
                    <option>DHL Stadium (CPT)</option>
                    <option>SunBet Arena (PTA)</option>
                </select>
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                <textarea rows={4} className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" placeholder="Tell people why they should come..."></textarea>
            </div>

            {/* Ticket Settings */}
            <div className="pt-6 border-t border-white/10">
                <h3 className="text-lg font-bold mb-4">Ticket Configuration</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">Standard Price (ZAR)</label>
                        <input type="number" placeholder="250" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-300 mb-2">VIP Price (ZAR)</label>
                        <input type="number" placeholder="1000" className="w-full bg-slate-900/50 border border-slate-700 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-indigo-500 transition-colors" />
                    </div>
                </div>
            </div>

            <div className="pt-6">
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-indigo-500/20 transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed">
                    {loading ? "Publishing..." : "Launch Event 🚀"}
                </button>
            </div>

        </form>
      </div>
    </main>
  );
}
