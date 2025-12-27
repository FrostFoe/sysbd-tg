"use client";

import { useUI } from "@/context/UIContext";
import { ArrowLeft, Phone, Info, MoreVertical, CheckCircle, X, Search } from "lucide-react";
import Link from "next/link";

export default function ChatHeader({ 
  chatId, chatName, isTyping, uploading, isSearchOpen, setIsSearchOpen, searchQuery, setSearchQuery 
}) {
  const { setActiveCall } = useUI();

  return (
    <header className="px-4 py-2 flex items-center justify-between shadow-sm z-10 shrink-0 h-[60px] bg-surface border-b border-default">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <Link href="/chats" className="md:hidden text-muted hover:text-primary transition"><ArrowLeft /></Link>
        <div className="w-10 h-10 rounded-full bg-accent flex items-center justify-center text-white font-bold text-xl flex-shrink-0">
          {chatId === "botfather" ? "B" : (chatName?.[0] || "C")}
        </div>
        <div className="flex flex-col min-w-0">
          <h2 className="font-bold text-[16px] leading-tight truncate text-primary">
            {chatName || "Chat"} 
            <CheckCircle size={12} className="text-accent inline-block ml-1 fill-white" />
          </h2>
          <span className="text-[13px] truncate text-muted">
            {isTyping ? "typing..." : (uploading ? "uploading media..." : "online")}
          </span>
        </div>
      </div>
      <div className="flex gap-4 text-muted items-center flex-shrink-0">
        {isSearchOpen ? (
          <div className="flex items-center bg-input rounded-full px-3 py-1 animate-in fade-in slide-in-from-right-2 duration-200">
            <input 
              autoFocus 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className="bg-transparent outline-none text-xs w-24 text-primary"
            />
            <button onClick={() => { setIsSearchOpen(false); setSearchQuery(""); }}><X size={14} /></button>
          </div>
        ) : (
          <button onClick={() => setIsSearchOpen(true)} className="hover:text-accent transition"><Search size={20} /></button>
        )}
        <button onClick={() => setActiveCall({ type: 'audio', user: { name: 'Chat' } })} className="hover:text-accent transition"><Phone className="w-5 h-5" /></button>
        <button className="hover:text-accent transition"><Info className="w-5 h-5" /></button>
        <button className="hover:text-accent transition"><MoreVertical className="w-5 h-5" /></button>
      </div>
    </header>
  );
}
