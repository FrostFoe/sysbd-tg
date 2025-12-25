"use client";

export default function ChatsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-chat relative">
      {/* Telegram Background Pattern */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none telegram-pattern" 
      />
      <div className="bg-black/20 dark:bg-white/10 text-white px-4 py-1 rounded-full text-sm backdrop-blur-sm z-10">
        Select a chat to start messaging
      </div>
    </div>
  );
}