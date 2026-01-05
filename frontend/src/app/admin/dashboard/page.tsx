
"use client";

import Navbar from "@/components/Navbar";
import React, { useState } from 'react';

export default function AdminDashboard() {
  // Mock Data for Admin View
  const [approvals, setApprovals] = useState([
    { id: 1, organizer: "Mojo Concerts", event: "Neon Run 2026", date: "12 Dec 2026", status: "PENDING" },
    { id: 2, organizer: "Comedy Central", event: "Trevor Noah Special", date: "14 Feb 2027", status: "PENDING" },
  ]);

  const handleApprove = (id: number) => {
    setApprovals(approvals.map(a => a.id === id ? { ...a, status: "APPROVED" } : a));
  };

  const handleReject = (id: number) => {
    setApprovals(approvals.filter(a => a.id !== id));
  };

  return (
    <main className="min-h-screen bg-slate-900 text-slate-100 pb-20">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32">
        <div className="flex justify-between items-end mb-10">
            <div>
                <h6 className="text-indigo-400 font-bold tracking-wider uppercase text-xs mb-2">System Admin</h6>
                <h1 className="text-3xl font-heading font-bold">Platform Overview</h1>
            </div>
            <div className="flex gap-2">
                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-green-500/10 text-green-400 text-xs font-mono">
                    <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                    SYSTEM ONLINE
                </span>
                <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 text-indigo-400 text-xs font-mono">
                    DB: CONNECTED
                </span>
            </div>
        </div>

        {/* Global Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
            {[ 
                { label: "Total Platform Revenue", value: "R 12.4M", color: "text-white" },
                { label: "Active Users", value: "124,592", color: "text-blue-400" },
                { label: "Flagged Transactions", value: "3", color: "text-red-400" },
                { label: "Server Load", value: "42%", color: "text-green-400" }
            ].map((stat, i) => (
                <div key={i} className="glass-card bg-slate-800/50 p-6 border-l-4 border-indigo-500/50">
                    <div className="text-slate-500 text-xs uppercase font-bold mb-2">{stat.label}</div>
                    <div className={`text-3xl font-mono ${stat.color}`}>{stat.value}</div>
                </div>
            ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Event Approval Queue */}
            <div className="glass-card p-0 overflow-hidden">
                <div className="p-6 bg-white/5 border-b border-white/5 flex justify-between items-center">
                    <h3 className="font-bold flex items-center gap-2">
                        📋 Event Approval Queue
                        <span className="px-2 py-0.5 rounded-full bg-indigo-500 text-white text-xs">{approvals.filter(a => a.status === 'PENDING').length}</span>
                    </h3>
                </div>
                <div className="p-6">
                    {approvals.filter(a => a.status === 'PENDING').length === 0 ? (
                        <div className="text-center text-slate-500 py-8">All caught up! No pending approvals.</div>
                    ) : (
                        <div className="space-y-4">
                            {approvals.filter(a => a.status === 'PENDING').map((item) => (
                                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-900/50 rounded-lg border border-white/5">
                                    <div>
                                        <div className="font-bold text-lg">{item.event}</div>
                                        <div className="text-sm text-slate-400">{item.organizer} • {item.date}</div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button onClick={() => handleReject(item.id)} className="px-3 py-2 text-xs font-bold text-red-400 hover:bg-red-500/10 rounded-md transition-colors">REJECT</button>
                                        <button onClick={() => handleApprove(item.id)} className="px-3 py-2 text-xs font-bold bg-indigo-600 hover:bg-indigo-500 text-white rounded-md transition-colors">APPROVE</button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Fraud Detection / Security Feed */}
            <div className="glass-card p-0 overflow-hidden border-red-500/20">
                <div className="p-6 bg-red-500/10 border-b border-red-500/10 flex justify-between items-center">
                    <h3 className="font-bold text-red-100 flex items-center gap-2">
                        🛡️ Security / Fraud Alerts
                    </h3>
                </div>
                <div className="p-0">
                    <div className="divide-y divide-white/5 bg-slate-900/30">
                        {[
                            { msg: "Multiple failed login attempts detected (PTA)", time: "2 mins ago", severity: "medium" },
                            { msg: "Suspicious bulk purchase: 50 tickets (User ID: 8821)", time: "18 mins ago", severity: "high" },
                            { msg: "Payment gateway timeout warning (Ozow)", time: "1 hour ago", severity: "low" },
                        ].map((alert, i) => (
                            <div key={i} className="p-4 flex gap-4 items-start hover:bg-white/5 transition-colors cursor-pointer">
                                <div className={`w-2 h-2 mt-2 rounded-full ${alert.severity === 'high' ? 'bg-red-500 animate-pulse' : alert.severity === 'medium' ? 'bg-orange-400' : 'bg-yellow-400'}`}></div>
                                <div>
                                    <p className="text-sm text-slate-300">{alert.msg}</p>
                                    <p className="text-xs text-slate-500 mt-1">{alert.time}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

        </div>

      </div>
    </main>
  );
}
