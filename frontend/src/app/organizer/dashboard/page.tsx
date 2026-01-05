
"use client";

import Navbar from "@/components/Navbar";
import Link from "next/link";

export default function OrganizerDashboard() {
  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32">
        <div className="flex justify-between items-center mb-10">
            <div>
                <h1 className="text-3xl font-heading font-bold">Organizer Dashboard</h1>
                <p className="text-slate-400">Welcome back, Mojo Concerts</p>
            </div>
            <Link href="/organizer/create">
                <button className="bg-indigo-600 hover:bg-indigo-500 px-6 py-3 rounded-lg font-semibold transition-colors flex items-center gap-2">
                    <span>+</span> Create Event
                </button>
            </Link>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[ 
                { label: "Total Revenue", value: "R 2,450,000", change: "+12%" },
                { label: "Tickets Sold", value: "8,500", change: "+5%" },
                { label: "Upcoming Events", value: "3", change: "0" },
                { label: "Check-in Rate", value: "94%", change: "+2%" }
            ].map((stat, i) => (
                <div key={i} className="glass-card bg-slate-800/50 p-6">
                    <div className="text-slate-400 text-sm mb-1">{stat.label}</div>
                    <div className="text-2xl font-bold mb-2">{stat.value}</div>
                    <div className={`text-xs ${stat.change.includes('+') ? 'text-green-400' : 'text-slate-500'}`}>
                        {stat.change} from last month
                    </div>
                </div>
            ))}
        </div>

        {/* Recent Events List */}
        <h2 className="text-xl font-bold mb-6">Your Events</h2>
        <div className="bg-slate-800/30 rounded-2xl border border-white/5 overflow-hidden">
            <table className="w-full text-left">
                <thead className="bg-slate-900/50 text-slate-400 text-sm uppercase font-semibold">
                    <tr>
                        <th className="p-6">Event</th>
                        <th className="p-6">Date</th>
                        <th className="p-6">Status</th>
                        <th className="p-6">Sold</th>
                        <th className="p-6 text-right">Actions</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                    {[
                        { title: "Soweto Derby", date: "20 Mar 2026", status: "Selling Fast", sold: "45,000 / 94,000" },
                        { title: "Black Coffee Live", date: "15 Apr 2026", status: "Sold Out", sold: "56,000 / 56,000" },
                        { title: "Comedy Nights", date: "02 May 2026", status: "Draft", sold: "0 / 500" },
                    ].map((event, i) => (
                        <tr key={i} className="hover:bg-white/5 transition-colors">
                            <td className="p-6 font-medium">{event.title}</td>
                            <td className="p-6 text-slate-400">{event.date}</td>
                            <td className="p-6">
                                <span className={`px-3 py-1 rounded-full text-xs font-bold 
                                    ${event.status === 'Sold Out' ? 'bg-red-500/20 text-red-400' : 
                                      event.status === 'Draft' ? 'bg-slate-600/20 text-slate-400' : 
                                      'bg-green-500/20 text-green-400'}`}>
                                    {event.status}
                                </span>
                            </td>
                            <td className="p-6 text-slate-300">{event.sold}</td>
                            <td className="p-6 text-right">
                                <button className="text-indigo-400 hover:text-white text-sm font-medium">Manage</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>

      </div>
    </main>
  );
}
