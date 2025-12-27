"use client";

import { useUI } from "@/context/UIContext";
import { X } from "lucide-react";
import { useState } from "react";

export default function NewFolderModal() {
  const { isNewFolderModalOpen, setIsNewFolderModalOpen, setFolders } = useUI();
  const [name, setName] = useState("");
  const [type, setType] = useState("all");

  if (!isNewFolderModalOpen) return null;

  const handleCreate = () => {
    if (!name.trim()) return;
    setFolders((prev) => [
      ...prev,
      { id: name.toLowerCase(), name, type, locked: false }
    ]);
    setIsNewFolderModalOpen(false);
    setName("");
  };

  return (
    <div className="fixed inset-0 z-[110] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-xs rounded-2xl bg-white dark:bg-[#212121] p-6 flex flex-col animate-in zoom-in duration-200 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg dark:text-white">New Folder</h3>
          <button onClick={() => setIsNewFolderModalOpen(false)}><X className="text-gray-400" /></button>
        </div>
        
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-3 rounded-xl border border-gray-200 dark:border-black bg-gray-50 dark:bg-[#1c1c1d] outline-none focus:border-accent dark:text-white mb-4"
          placeholder="Folder Name"
        />

        <div className="flex gap-2 mb-6">
          {["all", "private", "group"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg border capitalize transition ${type === t ? "bg-accent border-accent text-white" : "border-gray-200 dark:border-black text-gray-500"}`}
            >
              {t}
            </button>
          ))}
        </div>

        <button 
          onClick={handleCreate}
          className="w-full py-3 bg-accent text-white font-bold rounded-xl shadow-lg shadow-blue-200 dark:shadow-none transition hover:opacity-90"
        >
          Create Folder
        </button>
      </div>
    </div>
  );
}
