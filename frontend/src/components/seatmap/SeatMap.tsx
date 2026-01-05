
"use client";

import React from 'react';
import { motion } from "framer-motion";

type SeatStatus = 'AVAILABLE' | 'LOCKED' | 'SOLD' | 'SELECTED';

interface Seat {
  id: number;
  row: string;
  number: string;
  status: SeatStatus;
  price: number;
}

interface SeatMapProps {
  seats: Seat[];
  onSeatSelect: (seat: Seat) => void;
  selectedSeats: number[];
}

export default function SeatMap({ seats, onSeatSelect, selectedSeats }: SeatMapProps) {
  // Group seats by row for rendering
  const rows = seats.reduce((acc, seat) => {
    if (!acc[seat.row]) acc[seat.row] = [];
    acc[seat.row].push(seat);
    return acc;
  }, {} as Record<string, Seat[]>);

  const sortedRowKeys = Object.keys(rows).sort();

  return (
    <div className="w-full overflow-x-auto p-8 bg-slate-800/50 rounded-3xl border border-white/5 shadow-inner backdrop-blur-sm">
      <div className="min-w-[600px] flex flex-col items-center gap-4">
        {/* Stage / Field Visual */}
        <div className="w-2/3 h-12 bg-gradient-to-b from-indigo-500/20 to-transparent rounded-t-full mb-8 flex items-center justify-center text-indigo-300 text-sm font-semibold tracking-[0.2em] border-t border-indigo-500/30 shadow-[0_-10px_20px_rgba(99,102,241,0.1)]">
          STAGE / FIELD
        </div>

        {sortedRowKeys.map((rowKey, rowIndex) => (
          <motion.div 
            key={rowKey} 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: rowIndex * 0.1 }}
            className="flex gap-2 items-center"
          >
            <span className="w-6 text-center text-slate-500 text-xs font-bold font-mono">{rowKey}</span>
            <div className="flex gap-2">
              {rows[rowKey].sort((a, b) => parseInt(a.number) - parseInt(b.number)).map((seat, seatIndex) => {
                const isSelected = selectedSeats.includes(seat.id);
                const isSold = seat.status === 'SOLD';
                const isLocked = seat.status === 'LOCKED';
                
                let seatColor = "bg-slate-700 hover:bg-slate-600 hover:shadow-[0_0_10px_rgba(255,255,255,0.2)] cursor-pointer";
                if (isSold) seatColor = "bg-slate-800 cursor-not-allowed opacity-30";
                if (isLocked) seatColor = "bg-red-900/40 border border-red-500/30 cursor-not-allowed";
                if (isSelected) seatColor = "bg-gradient-to-br from-indigo-500 to-indigo-600 shadow-[0_0_15px_rgba(99,102,241,0.6)] border border-indigo-400 scale-110 z-10";

                return (
                  <motion.div
                    key={seat.id}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: (rowIndex * 0.05) + (seatIndex * 0.01), type: "spring" }}
                    whileHover={!isSold && !isLocked ? { scale: 1.2 } : {}}
                    whileTap={!isSold && !isLocked ? { scale: 0.9 } : {}}
                    onClick={() => !isSold && !isLocked && onSeatSelect(seat)}
                    className={`
                      w-9 h-9 rounded-t-lg rounded-b-md flex items-center justify-center text-[10px] text-white/90 font-medium
                      transition-colors duration-200 relative
                      ${seatColor}
                    `}
                    title={`Row ${rowKey} Seat ${seat.number} - R${seat.price}`}
                  >
                    {seat.number}
                    {isLocked && (
                        <span className="absolute inset-0 rounded-t-lg rounded-b-md animate-pulse bg-red-500/10"></span>
                    )}
                  </motion.div>
                );
              })}
            </div>
            <span className="w-6 text-center text-slate-500 text-xs font-bold font-mono">{rowKey}</span>
          </motion.div>
        ))}

        {/* Legend */}
        <div className="flex gap-8 mt-10 p-4 px-8 bg-slate-900/80 rounded-full text-xs text-slate-400 border border-white/5 shadow-xl backdrop-blur-md">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-700 rounded-full"></div> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-indigo-500 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.5)]"></div> Selected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-slate-800 opacity-30 rounded-full border border-white/10"></div> Sold
          </div>
          <div className="flex items-center gap-2">
             <div className="w-3 h-3 bg-red-900/60 rounded-full border border-red-500/30"></div> Reserved
          </div>
        </div>
      </div>
    </div>
  );
}
