"use client";

import { useEffect, useState, use, useCallback } from "react";
import { useAuth } from "@/context/AuthContext";
import { useUI } from "@/context/UIContext";
import { chatService } from "@/lib/chat";
import { mediaService } from "@/lib/media";
import ChatWindow from "@/components/ChatWindow";
import ChatHeader from "@/components/ChatHeader";
import MessageInput from "@/components/MessageInput";
import { X, Plus } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ChatDetailPage({ params }) {
  const { chatId } = use(params);
  const { user, loading } = useAuth();
  const { isPollModalOpen, setIsPollModalOpen, setForwardState } = useUI();
  
  const [messages, setMessages] = useState([]);
  const [fetching, setFetching] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [replyTo, setReplyTo] = useState(null);
  const [editingMessage, setEditingMessage] = useState(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [chatInfo, setChatInfo] = useState(null);
  const router = useRouter();

  const [botStep, setBotStep] = useState(0);
  const [pollData, setPollData] = useState({ question: '', options: ['', ''] });

  const loadMessages = useCallback(async () => {
    if (!user) return;
    try {
      // Fetch chat info
      if (chatId === 'botfather') {
        setChatInfo({ name: 'BotFather', type: 'bot' });
      } else if (chatId === 'saved_messages') {
        setChatInfo({ name: 'Saved Messages', type: 'private' });
      } else {
        const chats = await chatService.getChats(user.$id);
        const current = chats.find(c => c.$id === chatId);
        setChatInfo(current || { name: 'Chat', type: 'private' });
      }

      const data = await chatService.getMessages(chatId);
      setMessages(data);
    } catch (error) {
      console.error(error);
    } finally {
      setFetching(false);
    }
  }, [chatId, user]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setMessages(prev => {
        const remaining = prev.filter(m => !m.expiresAt || m.expiresAt > now);
        if (remaining.length !== prev.length) return remaining;
        return prev;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    } else if (user) {
      loadMessages();
      const unsubscribe = chatService.subscribeToMessages(chatId, (payload) => {
        setMessages((prev) => {
          if (payload.$deleted) return prev.filter(m => m.$id !== payload.$id);
          const index = prev.findIndex(m => m.$id === payload.$id);
          if (index !== -1) {
            const newArr = [...prev];
            newArr[index] = payload;
            return newArr;
          }
          return [...prev, payload];
        });
      });
      return () => unsubscribe();
    }
  }, [user, loading, chatId, router, loadMessages]);

  const handleSendMessage = async (content, type = "text", extras = {}) => {
    try {
      if (editingMessage) {
        await chatService.updateMessage(editingMessage.$id, { text: content, isEdited: true });
        setEditingMessage(null);
        return;
      }

      const payload = { ...extras };
      if (extras.selfDestructTime > 0) {
        payload.expiresAt = Date.now() + (extras.selfDestructTime * 1000) + 2000;
      }

      if (replyTo) {
        payload.replyToId = replyTo.$id;
        payload.replyToText = replyTo.text || `[${replyTo.type}]`;
        setReplyTo(null);
      }

      if (type === "game") {
        await chatService.sendGameMessage(chatId, user?.$id);
      } else if (type === "sticker" || type === "gif") {
        await chatService.sendMessage(chatId, user?.$id, "", type, { ...payload, fileUrl: content });
      } else {
        await chatService.sendMessage(chatId, user?.$id, content, type, payload);
      }

      if (chatId !== "botfather") {
        setTimeout(() => setIsTyping(true), 1000);
        setTimeout(() => setIsTyping(false), 3000);
      }

      if (chatId === "botfather" || chatId === "99") {
         if (content === "/newbot") {
            setBotStep(1);
            setTimeout(() => chatService.sendMessage(chatId, "botfather", "Alright, a new bot. How are we going to call it? Please choose a name for your bot."), 800);
         } else if (botStep === 1) {
            setBotStep(2);
            setTimeout(() => chatService.sendMessage(chatId, "botfather", "Good. Now let's choose a username for your bot. It must end in `bot`."), 800);
         } else if (botStep === 2) {
            setBotStep(0);
            const botName = content;
            setTimeout(() => chatService.sendMessage(chatId, "botfather", `Done! Congratulations on your new bot. You can find it at t.me/${botName}_bot.\n\nUse this token to access the HTTP API:\n${Math.random().toString(36).substring(7)}:${Math.random().toString(36).substring(7)}`), 1000);
         }
      }
    } catch (error) {
      console.error("Failed to send message", error);
    }
  };

  const handleSendMedia = async (file) => {
    try {
      setUploading(true);
      const { fileId, fileUrl } = await mediaService.uploadFile(file);
      const type = file.type.startsWith("image/") ? "image" : "video";
      await chatService.sendMediaMessage(chatId, user?.$id, fileId, fileUrl, type);
    } catch (error) {
      console.error("Failed to send media", error);
    } finally {
      setUploading(false);
    }
  };

  const handleReply = (id) => setReplyTo(messages.find(m => m.$id === id));
  const handleEdit = (id) => {
    const msg = messages.find(m => m.$id === id);
    if (msg?.senderId === user?.$id) setEditingMessage(msg);
  };
  const handlePin = async (id) => {
    const msg = messages.find(m => m.$id === id);
    await chatService.updateMessage(id, { isPinned: !msg.isPinned });
  };
  const handleDelete = async (id) => await chatService.deleteMessage(id);
  const handleForward = (id) => {
    const msg = messages.find(m => m.$id === id);
    if (msg) setForwardState({ isOpen: true, messageId: id, messageText: msg.text || `[${msg.type}]` });
  };
  const handleTranslate = async (id) => {
    const msg = messages.find(m => m.$id === id);
    if (msg?.text) {
      const translated = "[Translated] " + msg.text.split('').reverse().join('');
      await chatService.updateMessage(id, { text: translated });
    }
  };

  const handleReaction = async (messageId, emoji) => {
    const msg = messages.find(m => m.$id === messageId);
    if (!msg) return;
    const reactions = [...(msg.reactions || [])];
    const existing = reactions.find(r => r.emoji === emoji);
    if (existing) {
      existing.count += 1;
      existing.me = true;
    } else {
      reactions.push({ emoji, count: 1, me: true });
    }
    await chatService.updateMessage(messageId, { reactions });
  };

  const pinnedMessage = messages.find(m => m.isPinned);
  const filteredMessages = messages.filter(m => 
    !searchQuery || (m.text && m.text.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (fetching) {
    return (
      <div className="flex flex-1 items-center justify-center bg-[#99ba92] dark:bg-[#0f0f0f]">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-white border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col h-full bg-white dark:bg-[#0f0f0f] relative overflow-hidden">
      {/* Poll Creation Modal within ChatDetailPage */}
      {isPollModalOpen && (
        <div className="fixed inset-0 z-[60] bg-black/50 flex items-center justify-center p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white dark:bg-[#212121] shadow-2xl overflow-hidden animate-in zoom-in duration-200">
            <div className="p-4 border-b dark:border-gray-800 flex justify-between items-center">
              <h3 className="font-bold dark:text-white">New Poll</h3>
              <button onClick={() => setIsPollModalOpen(false)}><X className="text-gray-400" /></button>
            </div>
            <div className="p-4 flex flex-col gap-3">
              <input type="text" placeholder="Question" value={pollData.question} onChange={e => setPollData({...pollData, question: e.target.value})} className="w-full p-3 rounded-xl bg-gray-100 dark:bg-[#1c1c1d] outline-none border border-transparent focus:border-accent dark:text-white" />
              {pollData.options.map((opt, i) => (
                <input key={i} type="text" placeholder={`Option ${i+1}`} value={opt} onChange={e => { const newOpts = [...pollData.options]; newOpts[i] = e.target.value; setPollData({...pollData, options: newOpts}); }} className="w-full p-3 rounded-xl bg-gray-100 dark:bg-[#1c1c1d] outline-none border border-transparent focus:border-accent dark:text-white" />
              ))}
              <button onClick={() => setPollData({...pollData, options: [...pollData.options, '']})} className="text-sm font-medium text-accent flex items-center gap-1 w-fit"><Plus size={16}/> Add option</button>
              <button onClick={async () => { if (!pollData.question || pollData.options.filter(o => o.trim()).length < 2) return; await chatService.sendPollMessage(chatId, user?.$id, pollData.question, pollData.options.filter(o => o.trim())); setIsPollModalOpen(false); setPollData({ question: '', options: ['', ''] }); }} className="w-full py-3 bg-accent text-white rounded-xl font-bold mt-2">Create Poll</button>
            </div>
          </div>
        </div>
      )}

      <ChatHeader 
        chatId={chatId} 
        chatName={chatInfo?.name || "Chat"}
        isTyping={isTyping} 
        uploading={uploading} 
        isSearchOpen={isSearchOpen} setIsSearchOpen={setIsSearchOpen} 
        searchQuery={searchQuery} setSearchQuery={setSearchQuery} 
      />

      {pinnedMessage && (
        <div className="px-4 py-2 border-b flex items-center justify-between gap-3 text-sm cursor-pointer z-10 bg-white dark:bg-[#1c1c1d] border-gray-100 dark:border-black shadow-sm">
          <div className="flex items-center gap-3 overflow-hidden min-w-0" onClick={() => document.getElementById(pinnedMessage.$id)?.scrollIntoView({ behavior: 'smooth', block: 'center' })}>
            <div className="w-0.5 h-8 rounded-full bg-accent flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-accent uppercase tracking-wider">Pinned Message</span>
              <span className="truncate text-gray-500 dark:text-gray-400 text-xs">{pinnedMessage.text || pinnedMessage.type}</span>
            </div>
          </div>
          <button onClick={() => handlePin(pinnedMessage.$id)} className="p-1 text-gray-400 hover:text-gray-600 transition"><X size={16} /></button>
        </div>
      )}

      <ChatWindow 
        messages={filteredMessages} currentUserId={user?.$id} 
        onGameMove={async (mid, idx) => {
           const msg = messages.find(m => m.$id === mid);
           const newBoard = [...msg.gameState.board];
           newBoard[idx] = msg.gameState.xIsNext ? 'X' : 'O';
           const winner = ((s) => { const lines = [[0,1,2],[3,4,5],[6,7,8],[0,3,6],[1,4,7],[2,5,8],[0,4,8],[2,4,6]]; for (let [a,b,c] of lines) if (s[a] && s[a] === s[b] && s[a] === s[c]) return s[a]; return null; })(newBoard);
           await chatService.updateMessage(mid, { gameState: { board: newBoard, xIsNext: !msg.gameState.xIsNext, winner } });
        }}
        onVote={async (mid, oid) => {
           const msg = messages.find(m => m.$id === mid);
           const newOptions = msg.options.map(o => o.id === oid ? { ...o, votes: o.votes + 1, voted: true } : o);
           await chatService.updateMessage(mid, { options: newOptions });
        }}
        onReply={handleReply} onEdit={handleEdit} onPin={handlePin} onDelete={handleDelete} onForward={handleForward} onTranslate={handleTranslate} onReaction={handleReaction}
      />

      {(replyTo || editingMessage) && (
        <div className="px-4 py-2 border-t border-gray-100 dark:border-black bg-white dark:bg-[#1c1c1d] flex items-center justify-between gap-4 animate-in slide-in-from-bottom-2 duration-200 shadow-lg">
          <div className="flex items-center gap-3 overflow-hidden">
            <div className="w-0.5 h-8 rounded-full bg-accent flex-shrink-0" />
            <div className="flex flex-col min-w-0">
              <span className="font-semibold text-xs text-accent">{editingMessage ? "Edit Message" : `Reply to ${replyTo.senderId === user?.$id ? "You" : "User"}`}</span>
              <span className="truncate text-gray-500 dark:text-gray-400 text-xs">{editingMessage ? editingMessage.text : (replyTo.text || replyTo.type)}</span>
            </div>
          </div>
          <button onClick={() => { setReplyTo(null); setEditingMessage(null); }}><X size={16} className="text-gray-400" /></button>
        </div>
      )}
      
      <MessageInput onSendMessage={handleSendMessage} onSendMedia={handleSendMedia} initialText={editingMessage?.text} />
    </div>
  );
}