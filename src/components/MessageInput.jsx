"use client";

import { useState, useRef, useEffect } from "react";
import { 
  Paperclip, Send, Mic, Smile, Clock, ImageIcon, 
  PenTool, Gamepad2, Film, BarChart2, Eye, Check
} from "lucide-react";
import { useUI } from "@/context/UIContext";

const COMMON_EMOJIS = ["👍", "❤️", "😂", "😮", "😢", "🔥", "🎉", "💩", "🥰", "🤔", "👋", "🙏", "👀", "✨"];

const STICKERS = [
  "https://cdn-icons-png.flaticon.com/128/9408/9408166.png",
  "https://cdn-icons-png.flaticon.com/128/9408/9408201.png",
  "https://cdn-icons-png.flaticon.com/128/9408/9408175.png",
  "https://cdn-icons-png.flaticon.com/128/9408/9408226.png",
  "https://cdn-icons-png.flaticon.com/128/9408/9408183.png",
  "https://cdn-icons-png.flaticon.com/128/9408/9408238.png"
];

const GIFS = [
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXp1ZGI4Z3J5aG56Y3h6Z3I1Z3I1Z3I1Z3I1Z3I1Z3I1/3o7TKSjRrfIPjeiVyM/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXp1ZGI4Z3J5aG56Y3h6Z3I1Z3I1Z3I1Z3I1Z3I1Z3I1/26AHONQ79FdWZhAI0/giphy.gif",
  "https://media.giphy.com/media/v1.Y2lkPTc5MGI3NjExbXp1ZGI4Z3J5aG56Y3h6Z3I1Z3I1Z3I1Z3I1Z3I1Z3I1/l0HlHJGHe3yAMhdQY/giphy.gif"
];

export default function MessageInput({ onSendMessage, onSendMedia, initialText = "" }) {
  const [text, setText] = useState("");
  const [isAttachMenuOpen, setIsAttachMenuOpen] = useState(false);
  const [isTimerMenuOpen, setIsTimerMenuOpen] = useState(false);
  const [isScheduleMenuOpen, setIsScheduleMenuOpen] = useState(false);
  const [selfDestructTime, setSelfDestructTime] = useState(0);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [pickerTab, setPickerTab] = useState("emoji");
  const fileInputRef = useRef(null);
  
  const { setIsDrawingOpen, setIsPollModalOpen, accentColor } = useUI();

  useEffect(() => {
    if (initialText) setText(initialText);
  }, [initialText]);

  const handleSubmit = (e, scheduled = false) => {
    e?.preventDefault();
    if (text.trim()) {
      onSendMessage(text, "text", { selfDestructTime, isScheduled: scheduled });
      setText("");
      setSelfDestructTime(0);
      setIsScheduleMenuOpen(false);
    }
  };

  const handleMediaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onSendMedia(file);
      setIsAttachMenuOpen(false);
    }
  };

  useEffect(() => {
    const handleClick = () => {
      setIsAttachMenuOpen(false);
      setIsTimerMenuOpen(false);
      setShowEmojiPicker(false);
      setIsScheduleMenuOpen(false);
    };
    window.addEventListener("click", handleClick);
    return () => window.removeEventListener("click", handleClick);
  }, []);

  return (
    <div className="px-2 py-2 z-30 w-full bg-surface border-t border-default relative">
      
      {isAttachMenuOpen && (
        <div className="absolute bottom-16 left-2 w-52 bg-surface rounded-xl shadow-xl border border-default py-2 animate-in slide-in-from-bottom-2 duration-200 flex flex-col z-50">
          <button onClick={() => fileInputRef.current?.click()} className="flex items-center gap-4 px-4 py-2.5 hover:bg-hover text-sm text-primary"><ImageIcon size={20} className="text-blue-500" /> Photo or Video</button>
          <button onClick={() => { setIsDrawingOpen(true); setIsAttachMenuOpen(false); }} className="flex items-center gap-4 px-4 py-2.5 hover:bg-hover text-sm text-primary"><PenTool size={20} className="text-orange-500" /> Draw</button>
          <button onClick={() => { onSendMessage("", "game"); setIsAttachMenuOpen(false); }} className="flex items-center gap-4 px-4 py-2.5 hover:bg-hover text-sm text-primary"><Gamepad2 size={20} className="text-purple-500" /> Game</button>
          <button onClick={() => { setIsPollModalOpen(true); setIsAttachMenuOpen(false); }} className="flex items-center gap-4 px-4 py-2.5 hover:bg-hover text-sm text-primary"><BarChart2 size={20} className="text-yellow-500" /> Poll</button>
          <button className="flex items-center gap-4 px-4 py-2.5 hover:bg-hover text-sm text-primary"><Film size={20} className="text-blue-400" /> File</button>
        </div>
      )}

      {isTimerMenuOpen && (
        <div className="absolute bottom-16 right-14 w-32 bg-surface rounded-xl shadow-xl border border-default py-2 animate-in slide-in-from-bottom-2 duration-200 flex flex-col z-50">
          <div className="px-4 py-1 text-[10px] font-bold text-muted uppercase">Self-Destruct</div>
          {[0, 5, 10, 30, 60].map(t => (
            <button key={t} onClick={() => setSelfDestructTime(t)} className="flex items-center justify-between px-4 py-2 hover:bg-hover text-sm text-primary">
              <span>{t === 0 ? 'Off' : `${t}s`}</span>
              {selfDestructTime === t && <Check size={14} className="text-accent" />}
            </button>
          ))}
        </div>
      )}

      {isScheduleMenuOpen && (
        <div className="absolute bottom-16 right-4 w-48 bg-surface rounded-xl shadow-xl border border-default py-2 animate-in slide-in-from-bottom-2 duration-200 flex flex-col z-50">
          <button onClick={(e) => handleSubmit(e, true)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-hover text-sm text-primary"><Clock size={16} /> Schedule Message</button>
          <button onClick={(e) => handleSubmit(e, false)} className="flex items-center gap-3 px-4 py-2.5 hover:bg-hover text-sm text-primary"><Send size={16} /> Send Now</button>
        </div>
      )}

      {showEmojiPicker && (
        <div className="absolute bottom-full left-0 mb-2 w-80 h-72 bg-surface rounded-xl shadow-2xl border border-default flex flex-col overflow-hidden z-50">
          <div className="flex border-b border-default">
            {['emoji', 'sticker', 'gif'].map(tab => (
              <button key={tab} onClick={(e) => { e.stopPropagation(); setPickerTab(tab); }} className={`flex-1 py-2 text-[10px] font-bold uppercase transition ${pickerTab === tab ? 'text-accent border-b-2 border-accent' : 'text-muted'}`}>{tab}</button>
            ))}
          </div>
          <div className="flex-1 p-2 overflow-y-auto custom-scrollbar">
            {pickerTab === 'emoji' && (
              <div className="grid grid-cols-7 gap-1">
                {COMMON_EMOJIS.map(e => (
                  <button key={e} onClick={(ev) => { ev.stopPropagation(); setText(t => t + e); }} className="text-2xl hover:bg-hover rounded p-1 transition">{e}</button>
                ))}
              </div>
            )}
            {pickerTab === 'sticker' && (
              <div className="grid grid-cols-3 gap-2">
                {STICKERS.map((s, i) => (
                  <img key={i} src={s} onClick={(ev) => { ev.stopPropagation(); onSendMessage(s, "sticker"); setShowEmojiPicker(false); }} className="w-full aspect-square cursor-pointer hover:scale-110 transition" alt="Sticker" />
                ))}
              </div>
            )}
            {pickerTab === 'gif' && (
              <div className="grid grid-cols-2 gap-2">
                {GIFS.map((g, i) => (
                  <img key={i} src={g} onClick={(ev) => { ev.stopPropagation(); onSendMessage(g, "gif"); setShowEmojiPicker(false); }} className="w-full aspect-video rounded-lg cursor-pointer hover:scale-105 transition object-cover" alt="GIF" />
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="flex items-end gap-2 max-w-4xl mx-auto" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          onClick={(e) => { e.stopPropagation(); setIsAttachMenuOpen(!isAttachMenuOpen); }}
          className={`p-3 text-muted hover:bg-hover rounded-full transition ${isAttachMenuOpen ? 'rotate-45' : ''}`}
        >
          <Paperclip className="w-6 h-6" />
        </button>
        
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*,video/*" onChange={handleMediaChange} />

        <div className="flex-1 relative rounded-2xl flex items-center bg-input">
          <input
            type="text"
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && handleSubmit(e)}
            placeholder="Message"
            className="flex-1 bg-transparent border-none outline-none px-4 py-3 text-primary placeholder-muted"
          />
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setIsTimerMenuOpen(!isTimerMenuOpen); }}
            className={`p-2 transition ${selfDestructTime > 0 ? 'text-red-500' : 'text-muted hover:text-secondary'}`}
          >
            <Clock size={20} />
          </button>
          <button
            type="button"
            onClick={(e) => { e.stopPropagation(); setShowEmojiPicker(!showEmojiPicker); }}
            className="p-3 text-muted hover:text-secondary transition"
          >
            <Smile className="w-6 h-6" />
          </button>
        </div>

        {text.trim() ? (
          <button 
            type="submit" 
            onContextMenu={(e) => { e.preventDefault(); setIsScheduleMenuOpen(true); }}
            className="p-3 bg-accent text-white rounded-full hover:opacity-90 transition shadow-sm"
          >
            <Send className="w-6 h-6 fill-current" />
          </button>
        ) : (
          <button type="button" className="p-3 text-muted hover:bg-hover rounded-full transition">
            <Mic className="w-6 h-6" />
          </button>
        )}
      </form>
    </div>
  );
}
