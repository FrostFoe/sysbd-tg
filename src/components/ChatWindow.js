"use client";

import { useEffect, useRef, useState, useMemo } from "react";
import MessageBubble from "./MessageBubble";
import { Pin, Reply, Forward, Languages, Edit3, Trash2, X, Smile } from "lucide-react";

const COMMON_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "💩", "🥰", "🤔", "👋", "🙏", "👀", "✨"];

export default function ChatWindow({ 
  messages, 
  currentUserId, 
  onGameMove, 
  onVote, 
  onReply, 
  onEdit, 
  onPin, 
  onDelete,
  onForward,
  onTranslate,
  onReaction
}) {
  const scrollRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({ visible: false, x: 0, y: 0, messageId: null });
  const [reactionPicker, setReactionPicker] = useState({ visible: false, x: 0, y: 0, messageId: null });

  const groupedMessages = useMemo(() => {
    const groups = {};
    messages.forEach((msg) => {
      const date = new Date(msg.$createdAt || msg.createdAt);
      const dateLabel = date.toDateString() === new Date().toDateString() ? "Today" : 
                        date.toDateString() === new Date(Date.now() - 86400000).toDateString() ? "Yesterday" :
                        date.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      if (!groups[dateLabel]) groups[dateLabel] = [];
      groups[dateLabel].push(msg);
    });
    return groups;
  }, [messages]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleContextMenu = (e, messageId) => {
    e.preventDefault();
    setContextMenu({ visible: true, x: e.clientX, y: e.clientY, messageId });
    setReactionPicker({ visible: false });
  };

  useEffect(() => {
    const handleClick = () => {
      setContextMenu(p => ({ ...p, visible: false }));
      setReactionPicker(p => ({ ...p, visible: false }));
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div ref={scrollRef} className="flex-1 overflow-y-auto relative bg-[#99ba92] dark:bg-[#0f0f0f] custom-scrollbar">
      <div className="absolute inset-0 opacity-40 pointer-events-none telegram-pattern" />
      <div className="relative z-0 max-w-3xl mx-auto flex flex-col justify-end min-h-full p-4">
        {Object.entries(groupedMessages).map(([date, msgs]) => (
          <div key={date}>
            <div className="flex justify-center my-4 sticky top-2 z-10">
              <span className="bg-black/20 dark:bg-white/10 text-white text-xs px-3 py-1 rounded-full backdrop-blur-md font-medium">{date}</span>
            </div>
            {msgs.map((msg) => (
              <MessageBubble
                key={msg.$id}
                message={msg}
                isOwn={msg.senderId === currentUserId}
                onContextMenu={handleContextMenu}
                onGameMove={onGameMove}
                onVote={onVote}
                onReplyClick={(id) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}
              />
            ))}
          </div>
        ))}
      </div>

      {contextMenu.visible && (
        <div className="fixed z-[100] w-48 bg-white dark:bg-[#212121] rounded-xl shadow-xl border border-gray-100 dark:border-black py-2 animate-in fade-in scale-in duration-100 origin-top-left" style={{ top: contextMenu.y, left: contextMenu.x }}>
          <button onClick={() => onReply(contextMenu.messageId)} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm dark:text-white"><Reply size={16} className="text-gray-400" /> Reply</button>
          <button onClick={() => onEdit(contextMenu.messageId)} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm dark:text-white"><Edit3 size={16} className="text-gray-400" /> Edit</button>
          <button onClick={() => { setReactionPicker({ visible: true, x: contextMenu.x, y: contextMenu.y - 50, messageId: contextMenu.messageId }); setContextMenu(p => ({...p, visible: false})); }} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm dark:text-white"><Smile size={16} className="text-gray-400" /> React</button>
          <button onClick={() => onPin(contextMenu.messageId)} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm dark:text-white"><Pin size={16} className="text-gray-400" /> Pin</button>
          <button onClick={() => onForward(contextMenu.messageId)} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm dark:text-white"><Forward size={16} className="text-gray-400" /> Forward</button>
          <button onClick={() => onTranslate(contextMenu.messageId)} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm dark:text-white"><Languages size={16} className="text-gray-400" /> Translate</button>
          <div className="h-px bg-gray-100 dark:bg-gray-800 my-1" />
          <button onClick={() => onDelete(contextMenu.messageId)} className="flex items-center gap-4 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800 w-full text-left text-sm text-red-500"><Trash2 size={16} /> Delete</button>
        </div>
      )}

      {reactionPicker.visible && (
        <div className="fixed z-[110] p-2 bg-white dark:bg-[#212121] rounded-full shadow-2xl border border-gray-100 dark:border-black flex gap-1 animate-in slide-in-from-bottom-2 duration-200" style={{ top: reactionPicker.y, left: reactionPicker.x }}>
          {COMMON_EMOJIS.slice(0, 8).map(e => (
            <button key={e} onClick={() => onReaction(reactionPicker.messageId, e)} className="text-xl hover:scale-125 transition">{e}</button>
          ))}
        </div>
      )}
    </div>
  );
}