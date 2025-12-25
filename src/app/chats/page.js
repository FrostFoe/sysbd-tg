"use client";

export default function ChatsPage() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center bg-[#99ba92] relative">
      {/* Telegram Background Pattern */}
      <div 
        className="absolute inset-0 opacity-40 pointer-events-none" 
        style={{ 
          backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(0,0,0,0.1) 1px, transparent 0)',
          backgroundSize: '20px 20px'
        }}
      />
      <div className="bg-black/20 text-white px-4 py-1 rounded-full text-sm backdrop-blur-sm z-10">
        Select a chat to start messaging
      </div>
    </div>
  );
}