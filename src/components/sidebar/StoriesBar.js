"use client";

import { useUI } from "@/context/UIContext";
import { MOCK_STORIES } from "@/lib/constants";
import { Plus } from "lucide-react";

export default function StoriesBar() {
  const { setViewingStory } = useUI();

  return (
    <div className="flex gap-4 overflow-x-auto no-scrollbar mt-1 pb-2 px-1">
      <div className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer group">
        <div className="w-14 h-14 rounded-full border-2 border-dashed border-default flex items-center justify-center text-muted group-hover:border-accent transition">
          <Plus size={24} />
        </div>
        <span className="text-xs text-secondary font-medium">Story</span>
      </div>
      {MOCK_STORIES.map(s => (
        <div 
          key={s.id} 
          onClick={() => setViewingStory(s)} 
          className="flex flex-col items-center gap-1 min-w-[60px] cursor-pointer"
        >
          <div className="w-14 h-14 rounded-full p-[2px] bg-accent">
            <div className="w-full h-full rounded-full border-2 border-surface bg-input flex items-center justify-center font-bold text-accent">
              {s.avatar}
            </div>
          </div>
          <span className="text-xs font-medium">{s.user}</span>
        </div>
      ))}
    </div>
  );
}
