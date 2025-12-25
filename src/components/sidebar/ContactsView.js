"use client";

import { useUI } from "@/context/UIContext";
import { MOCK_CONTACTS } from "@/lib/constants";

export default function ContactsView({ onStartChat }) {
  const { darkMode } = useUI();

  return (
    <div className="p-2 flex flex-col gap-1">
      <div className="px-4 py-2 text-sm font-bold text-gray-500 uppercase">Contacts</div>
      {MOCK_CONTACTS.map((n, i) => (
        <button 
          key={i} 
          onClick={() => onStartChat(`user_${i}`, n)} 
          className={`flex items-center gap-3 px-3 py-2 w-full rounded-lg ${darkMode ? 'hover:bg-[#2c2c2e]' : 'hover:bg-gray-100'}`}
        >
          <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold">{n[0]}</div>
          <div className="text-left font-medium dark:text-white">{n}</div>
        </button>
      ))}
    </div>
  );
}
