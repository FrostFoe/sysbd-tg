"use client";

import { CheckCircle } from "lucide-react";
import { useState } from "react";

export default function Poll({ question, options, onVote }) {
  const totalVotes = options.reduce((acc, opt) => acc + opt.votes, 0);

  return (
    <div className="min-w-[240px] sm:min-w-[300px]">
      <div className="font-bold mb-3">{question}</div>
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const percentage = totalVotes > 0 ? Math.round((opt.votes / totalVotes) * 100) : 0;
          return (
            <button
              key={opt.id}
              onClick={() => !opt.voted && onVote(opt.id)}
              className={`relative overflow-hidden w-full text-left px-3 py-2 rounded-lg border transition group ${
                opt.voted 
                  ? "border-accent bg-accent/5" 
                  : "border-transparent bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10"
              }`}
            >
              {/* Progress Bar */}
              <div 
                className="absolute inset-0 bg-accent/20 transition-all duration-500"
                style={{ width: `${percentage}%` }}
              />
              
              <div className="relative flex justify-between items-center z-10">
                <span className="font-medium">{opt.text}</span>
                {opt.voted && <CheckCircle size={16} className="text-accent" />}
              </div>
              
              <div className="relative flex justify-between items-center z-10 text-[11px] opacity-60 mt-1">
                <span>{opt.votes} votes</span>
                <span>{percentage}%</span>
              </div>
            </button>
          );
        })}
      </div>
      <div className="text-[11px] opacity-50 mt-3 text-center border-t border-black/5 pt-2">
        {totalVotes} total votes • Anonymous Poll
      </div>
    </div>
  );
}
