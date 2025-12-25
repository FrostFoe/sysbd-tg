"use client";

import { useUI } from "@/context/UIContext";
import { Lock, FolderPlus } from "lucide-react";

export default function FoldersBar() {
  const { 
    folders, activeFolder, unlockedFolders, 
    setTargetFolder, setLockModalOpen, setActiveFolder, setIsNewFolderModalOpen 
  } = useUI();

  const handleFolderClick = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder?.locked && !unlockedFolders.includes(folderId)) {
      setTargetFolder(folderId);
      setLockModalOpen(true);
    } else {
      setActiveFolder(folderId);
    }
  };

  return (
    <div className="flex items-center gap-4 overflow-x-auto no-scrollbar border-b border-gray-100 dark:border-gray-800 pb-0 px-2">
      {folders.map(f => (
        <button 
          key={f.id} 
          onClick={() => handleFolderClick(f.id)} 
          className={`pb-2 text-sm font-medium transition whitespace-nowrap flex items-center gap-1 border-b-2 ${activeFolder === f.id ? 'border-accent text-accent' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
        >
          {f.locked && <Lock size={12} />}
          {f.name}
        </button>
      ))}
      <button 
        onClick={() => setIsNewFolderModalOpen(true)} 
        className="pb-2 text-gray-400 hover:text-accent transition px-2"
      >
        <FolderPlus size={16} />
      </button>
    </div>
  );
}
