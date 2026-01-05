
"use client";

import React, { useState } from 'react';

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
    <div className="w-full overflow-x-auto p-8 bg-slate-800/50 rounded-3xl border border-white/5 shadow-inner">
      <div className="min-w-[600px] flex flex-col items-center gap-4">
        {/* Stage / Field Visual */}
        <div className="w-2/3 h-12 bg-slate-700/50 rounded-t-full mb-8 flex items-center justify-center text-slate-500 text-sm font-semibold tracking-widest border-t border-white/10 shadow-[0_-10px_20px_rgba(0,0,0,0.2)]">
          STAGE / FIELD
        </div>

        {sortedRowKeys.map((rowKey) => (
          <div key={rowKey} className="flex gap-2 items-center">
            <span className="w-6 text-center text-slate-500 text-xs font-bold">{rowKey}</span>
            <div className="flex gap-2">
              {rows[rowKey].sort((a, b) => parseInt(a.number) - parseInt(b.number)).map((seat) => {
                const isSelected = selectedSeats.includes(seat.id);
                const isSold = seat.status === 'SOLD';
                const isLocked = seat.status === 'LOCKED';
                
                let seatColor = "bg-slate-600 hover:bg-slate-500 cursor-pointer";
                if (isSold) seatColor = "bg-slate-800 cursor-not-allowed opacity-40";
                if (isLocked) seatColor = "bg-red-900/50 cursor-not-allowed animate-pulse";
                if (isSelected) seatColor = "bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-110";

                return (
                  <div
                    key={seat.id}
                    onClick={() => !isSold && !isLocked && onSeatSelect(seat)}
                    className={`
                      w-8 h-8 rounded-t-lg rounded-b-md flex items-center justify-center text-[10px] text-white/80 font-medium
                      transition-all duration-200 border-b-2 border-black/20
                      ${seatColor}
                    `}
                    title={`Row ${rowKey} Seat ${seat.number} - R${seat.price}`}
                  >
                    {seat.number}
                  </div>
                );
              })}
            </div>
            <span className="w-6 text-center text-slate-500 text-xs font-bold">{rowKey}</span>
          </div>
        ))}

        {/* Legend */}
        <div className="flex gap-6 mt-8 p-4 bg-slate-900/50 rounded-full text-xs text-slate-400">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-600 rounded-sm"></div> Available
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-indigo-500 rounded-sm shadow-[0_0_10px_rgba(99,102,241,0.5)]"></div> Selected
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-slate-800 opacity-40 rounded-sm"></div> Sold
          </div>
          <div className="flex items-center gap-2">
             <div className="w-4 h-4 bg-red-900/50 rounded-sm"></div> Reserved
          </div>
        </div>
      </div>
    </div>
  );
}
