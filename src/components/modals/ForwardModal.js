"use client";

import { useUI } from "@/context/UIContext";
import { chatService } from "@/lib/chat";
import { useAuth } from "@/context/AuthContext";
import { X, Search, Send } from "lucide-react";
import { useState, useEffect } from "react";

export default function ForwardModal() {
  const { forwardState, setForwardState } = useUI();
  const { user } = useAuth();
  const [chats, setChats] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    if (forwardState.isOpen && user) {
      chatService.getChats(user.$id).then(setChats);
    }
  }, [forwardState.isOpen, user]);

  if (!forwardState.isOpen) return null;

  const handleForward = async (chatId) => {
    try {
      await chatService.sendMessage(
        chatId, 
        user?.$id, 
        forwardState.messageText, 
        "text", 
        { isForwarded: true }
      );
      setForwardState({ isOpen: false, messageId: null, messageText: "" });
    } catch (error) {
      console.error("Forward failed", error);
    }
  };

  const filtered = chats.filter(c => c.name?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="fixed inset-0 z-[120] bg-black/50 flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#212121] shadow-2xl overflow-hidden animate-in zoom-in duration-200 flex flex-col max-h-[80vh]">
        <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center bg-accent text-white">
          <h3 className="font-bold">Forward Message</h3>
          <button onClick={() => setForwardState({ isOpen: false, messageId: null, messageText: "" })}>
            <X size={20} />
          </button>
        </div>
        
        <div className="p-3 border-b dark:border-gray-800">
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-[#1c1c1d] rounded-xl border border-transparent focus-within:border-accent transition">
            <Search size={18} className="text-gray-400" />
            <input 
              type="text" 
              placeholder="Search chats..." 
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-transparent outline-none text-sm w-full dark:text-white"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          {filtered.map(chat => (
            <button 
              key={chat.$id}
              onClick={() => handleForward(chat.$id)}
              className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition border-b dark:border-gray-800 last:border-0"
            >
              <div className="w-10 h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold">
                {chat.name?.[0]}
              </div>
              <div className="flex-1 text-left min-w-0">
                <div className="font-bold text-sm dark:text-white truncate">{chat.name}</div>
                <div className="text-xs text-gray-500 truncate">{chat.type}</div>
              </div>
              <Send size={16} className="text-accent" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
