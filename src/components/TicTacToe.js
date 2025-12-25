"use client";

import { Gamepad2 } from "lucide-react";

export default function TicTacToe({ board, xIsNext, winner, onMove }) {
  return (
    <div className="min-w-[200px] flex flex-col items-center p-2 bg-black/5 dark:bg-white/5 rounded-xl">
      <div className="font-bold mb-3 flex items-center gap-2 text-sm">
        <Gamepad2 size={16} className="text-accent" /> Tic Tac Toe
      </div>
      
      <div className="grid grid-cols-3 gap-1.5">
        {board.map((cell, i) => (
          <button
            key={i}
            onClick={() => !cell && !winner && onMove(i)}
            disabled={!!cell || !!winner}
            className={`w-14 h-14 bg-white dark:bg-[#2c2c2e] rounded-lg flex items-center justify-center text-xl font-bold border border-black/5 shadow-sm transition active:scale-95 ${!cell && !winner ? 'hover:bg-gray-50 dark:hover:bg-[#3a3a3c]' : ''}`}
          >
            <span className={cell === 'X' ? 'text-blue-500' : 'text-red-500'}>
              {cell}
            </span>
          </button>
        ))}
      </div>
      
      <div className="mt-3 text-xs font-bold px-3 py-1 bg-accent/10 text-accent rounded-full">
        {winner ? `Winner: ${winner}!` : `Next: ${xIsNext ? 'X' : 'O'}`}
      </div>
    </div>
  );
}
