
"use client";

import Link from "next/link";
import Navbar from "@/components/Navbar";

// Represents what we would get from the backend API
const MOCK_TICKET = {
  id: "TCK-8X92Z",
  event: "Soweto Derby: Chiefs vs Pirates",
  venue: "FNB Stadium",
  seats: ["Row A - 12", "Row A - 13"],
  date: "20 Mar 2026, 15:00",
  qr_code: "https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=Ticketza-TCK-8X92Z", // Using public API for frontend demo if backend not connected
};

export default function CheckoutSuccessPage() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      <Navbar />

      <div className="pt-32 px-6 max-w-xl mx-auto text-center">
        <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-10 h-10 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        
        <h1 className="text-3xl font-heading font-bold mb-2">Payment Successful!</h1>
        <p className="text-slate-400 mb-12">Your seats are secured. Here is your digital ticket.</p>

        <div className="glass-card bg-white/5 p-0 overflow-hidden relative group">
          {/* Top colored bar */}
          <div className="h-4 bg-gradient-to-r from-indigo-500 to-pink-500"></div>
          
          <div className="p-8">
            <h2 className="text-2xl font-bold mb-1">{MOCK_TICKET.event}</h2>
            <p className="text-slate-400 text-sm mb-6">{MOCK_TICKET.venue} • {MOCK_TICKET.date}</p>

            <div className="bg-white p-4 rounded-xl inline-block mb-6 shadow-xl">
               {/* In a real app, this img src comes from backend base64 */}
               <img src={MOCK_TICKET.qr_code} alt="Ticket QR" className="w-48 h-48 opacity-90 mx-auto" />
            </div>

            <div className="flex justify-between items-center border-t border-white/10 pt-4 text-left">
                <div>
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Reference</div>
                    <div className="font-mono text-indigo-400">{MOCK_TICKET.id}</div>
                </div>
                <div className="text-right">
                    <div className="text-xs text-slate-500 uppercase font-bold tracking-wider">Seats</div>
                    <div className="text-white">{MOCK_TICKET.seats.join(", ")}</div>
                </div>
            </div>
          </div>
          
          {/* Detailed patterns/holes for ticket look */}
          <div className="absolute -left-3 top-2/3 w-6 h-6 bg-slate-900 rounded-full"></div>
          <div className="absolute -right-3 top-2/3 w-6 h-6 bg-slate-900 rounded-full"></div>
        </div>

        <div className="mt-10 flex flex-col gap-4">
            <button className="w-full bg-slate-800 hover:bg-slate-700 py-3 rounded-lg font-medium transition-colors">
                Download PDF
            </button>
            <Link href="/" className="text-indigo-400 hover:text-indigo-300 text-sm font-medium">
                Return to Home
            </Link>
        </div>

      </div>
    </main>
  );
}
