"use client";

import Link from "next/link";
import { useUI } from "@/context/UIContext";
import { useParams } from "next/navigation";

export default function ChatList({ chats, fetching, onContextMenu }) {
  const { chatId: activeChatId } = useParams();

  if (fetching) {
    return <div className="p-4 text-center text-muted text-sm">Loading...</div>;
  }

  if (chats.length === 0) {
    return <div className="p-8 text-center text-muted text-sm">No chats found</div>;
  }

  return (
    <div className="flex flex-col">
      {chats.map((chat) => (
        <Link 
          key={chat.$id} 
          href={`/chats/${chat.$id}`} 
          onContextMenu={(e) => onContextMenu(e, chat.$id)}
          className={`flex items-center gap-3 px-3 py-2 cursor-pointer transition select-none ${activeChatId === chat.$id ? 'bg-accent text-white' : 'hover:bg-hover'}`}
        >
          <div className="shrink-0">
            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-xl ${chat.type === 'group' ? 'bg-orange-400' : 'bg-accent'}`}>
              {chat.name?.[0] || 'C'}
            </div>
          </div>
          <div className={`flex-1 min-w-0 border-b pb-2 ml-1 h-full flex flex-col justify-center border-default ${activeChatId === chat.$id ? 'border-transparent' : ''}`}>
            <div className="flex justify-between items-baseline">
              <h3 className={`font-semibold text-[15px] truncate ${activeChatId === chat.$id ? 'text-white' : 'text-primary'}`}>{chat.name}</h3>
              <span className={`text-xs ${activeChatId === chat.$id ? 'text-white/80' : 'text-muted'}`}>
                {new Date(chat.$createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
            <p className={`text-[14px] truncate ${activeChatId === chat.$id ? 'text-white/80' : 'text-secondary'}`}>
              {chat.lastMessage || 'No messages'}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
