"use client";

import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import { X, QrCode } from "lucide-react";

export default function QRCodeModal() {
  const { isQRModalOpen, setIsQRModalOpen } = useUI();
  const { user } = useAuth();

  if (!isQRModalOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center p-4">
      <div className="w-80 rounded-2xl shadow-2xl bg-white dark:bg-[#212121] p-8 flex flex-col items-center relative animate-in zoom-in duration-200">
        <button onClick={() => setIsQRModalOpen(false)} className="absolute top-4 right-4 text-gray-400"><X size={20} /></button>
        <div className="w-20 h-20 rounded-full mb-4 bg-accent text-white flex items-center justify-center text-2xl font-bold">
          {user?.username?.[0] || user?.name?.[0]}
        </div>
        <h3 className="font-bold text-xl mb-1 dark:text-white">{user?.username || user?.name}</h3>
        <p className="text-gray-500 text-sm mb-6">@{user?.username || "user"}</p>
        <div className="bg-white p-4 rounded-xl shadow-inner border border-gray-100">
          <QrCode size={150} color="black" />
        </div>
        <p className="text-xs text-gray-400 mt-4 text-center">Scan this code to add me on Telegram</p>
      </div>
    </div>
  );
}
