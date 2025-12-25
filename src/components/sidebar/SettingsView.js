"use client";

import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import { ACCENT_COLORS } from "@/lib/constants";
import { Bell, Lock, Grid, QrCode } from "lucide-react";

export default function SettingsView() {
  const { 
    user, darkMode, accentColor, updateAccentColor, setIsQRModalOpen 
  } = useUI();
  const { user: authUser } = useAuth();

  return (
    <div className="flex flex-col">
      <div className="flex flex-col items-center py-6 border-b border-gray-100 dark:border-gray-800">
        <div className="w-24 h-24 rounded-full bg-accent text-white text-3xl font-bold flex items-center justify-center mb-3">
          {authUser?.username?.[0] || authUser?.name?.[0]}
        </div>
        <h2 className="text-xl font-bold dark:text-white">{authUser?.username || authUser?.name}</h2>
        <button 
          onClick={() => setIsQRModalOpen(true)}
          className="mt-3 text-sm text-accent font-medium flex items-center gap-1"
        >
          <QrCode size={14} /> My QR Code
        </button>
      </div>
      
      <div className="p-4 border-b border-gray-100 dark:border-gray-800">
        <div className="text-xs font-bold text-gray-500 uppercase mb-2">Accent Color</div>
        <div className="flex gap-2 justify-center">
          {ACCENT_COLORS.map(c => (
            <button
              key={c.value}
              onClick={() => updateAccentColor(c.value)}
              className={`w-8 h-8 rounded-full border-2 transition ${accentColor === c.value ? 'border-gray-600 dark:border-white scale-110' : 'border-transparent'}`}
              style={{ backgroundColor: c.value }}
            />
          ))}
        </div>
      </div>

      <div className="flex flex-col py-2">
        <button className={`flex items-center gap-4 px-6 py-3 transition ${darkMode ? 'hover:bg-[#2c2c2e]' : 'hover:bg-gray-100'}`}>
          <Bell className="w-5 h-5 text-gray-500" /> Notifications
        </button>
        <button className={`flex items-center gap-4 px-6 py-3 transition ${darkMode ? 'hover:bg-[#2c2c2e]' : 'hover:bg-gray-100'}`}>
          <Lock className="w-5 h-5 text-gray-500" /> Privacy and Security
        </button>
      </div>

      <div className="p-4">
        <div className="text-xs font-bold text-gray-500 uppercase mb-3 flex items-center gap-2">
          <Grid size={14} /> Shared Media
        </div>
        <div className="grid grid-cols-3 gap-1">
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden hover:opacity-80 cursor-pointer transition">
              <img src={`https://picsum.photos/seed/${i + 10}/200`} className="w-full h-full object-cover" alt="Media" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
