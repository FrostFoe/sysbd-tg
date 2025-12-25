"use client";

import { useUI } from "@/context/UIContext";
import { Shield, Mic, VolumeX, PhoneOff } from "lucide-react";
import { useState, useEffect } from "react";

export default function CallScreen() {
  const { activeCall, setActiveCall } = useUI();
  const [callTime, setCallTime] = useState(0);

  useEffect(() => {
    let timer;
    if (activeCall) {
      setCallTime(0);
      timer = setInterval(() => setCallTime(t => t + 1), 1000);
    }
    return () => clearInterval(timer);
  }, [activeCall]);

  if (!activeCall) return null;

  const formatCallTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="fixed inset-0 z-[100] bg-gray-900 flex flex-col items-center justify-center text-white animate-in fade-in duration-300">
      <div className="absolute top-10 left-10 flex items-center gap-2">
        <Shield className="w-5 h-5 text-green-400" />
        <span className="text-sm opacity-70">End-to-end encrypted</span>
      </div>
      <div className="w-32 h-32 rounded-full mb-6 border-4 border-gray-700 bg-gray-800 flex items-center justify-center text-4xl font-bold">
        {activeCall.user?.name?.[0] || "U"}
      </div>
      <h2 className="text-3xl font-bold mb-2">{activeCall.user?.name || "User"}</h2>
      <p className="text-gray-400 mb-12">{callTime > 0 ? formatCallTime(callTime) : "Ringing..."}</p>
      <div className="flex gap-16 items-center">
        <button className="p-4 bg-gray-700 rounded-full hover:bg-gray-600 transition"><Mic className="w-8 h-8" /></button>
        <button onClick={() => setActiveCall(null)} className="p-5 bg-red-500 rounded-full hover:bg-red-600 transition animate-pulse"><PhoneOff className="w-10 h-10" /></button>
        <button className="p-4 bg-gray-700 rounded-full hover:bg-gray-600 transition"><VolumeX className="w-8 h-8" /></button>
      </div>
    </div>
  );
}
