"use client";

import { useUI } from "@/context/UIContext";
import { Lock } from "lucide-react";
import { useState } from "react";

export default function FolderLockModal() {
  const { lockModalOpen, setLockModalOpen, targetFolder, setUnlockedFolders, setActiveFolder } = useUI();
  const [passcode, setPasscode] = useState("");

  if (!lockModalOpen) return null;

  const handleUnlock = () => {
    if (passcode === "1234") {
      setUnlockedFolders((prev) => [...prev, targetFolder]);
      setActiveFolder(targetFolder);
      setLockModalOpen(false);
      setPasscode("");
    } else {
      alert("Incorrect passcode. Hint: 1234");
      setPasscode("");
    }
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-2xl bg-white dark:bg-[#212121] p-6 flex flex-col items-center animate-in zoom-in duration-200">
        <div className="w-16 h-16 rounded-2xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center mb-4 text-gray-500">
          <Lock size={32} />
        </div>
        <h3 className="font-bold text-lg mb-1 dark:text-white">Folder Locked</h3>
        <p className="text-sm text-gray-500 mb-6 text-center">Enter passcode to view this folder</p>
        
        <input
          autoFocus
          type="password"
          value={passcode}
          onChange={(e) => setPasscode(e.target.value)}
          maxLength={4}
          className="w-full p-3 text-center text-2xl tracking-[1em] rounded-xl border border-gray-200 dark:border-black bg-gray-50 dark:bg-[#1c1c1d] outline-none focus:border-accent dark:text-white"
          placeholder="••••"
          onKeyDown={(e) => e.key === "Enter" && handleUnlock()}
        />

        <div className="flex gap-2 w-full mt-6">
          <button 
            onClick={() => setLockModalOpen(false)}
            className="flex-1 py-3 text-gray-500 dark:text-gray-400 font-medium hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition"
          >
            Cancel
          </button>
          <button 
            onClick={handleUnlock}
            className="flex-1 py-3 bg-accent text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition hover:opacity-90"
          >
            Unlock
          </button>
        </div>
      </div>
    </div>
  );
}
