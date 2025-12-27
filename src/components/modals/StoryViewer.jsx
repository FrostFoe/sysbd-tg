"use client";

import { useUI } from "@/context/UIContext";
import { X } from "lucide-react";
import { useState, useEffect } from "react";

export default function StoryViewer() {
  const { viewingStory, setViewingStory } = useUI();
  const [storyProgress, setStoryProgress] = useState(0);

  useEffect(() => {
    let timer;
    if (viewingStory) {
      setStoryProgress(0);
      timer = setInterval(() => {
        setStoryProgress((p) => {
          if (p >= 100) {
            setViewingStory(null);
            return 0;
          }
          return p + 1;
        });
      }, 50);
    }
    return () => clearInterval(timer);
  }, [viewingStory, setViewingStory]);

  if (!viewingStory) return null;

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center">
      <div className="absolute top-4 w-full px-4 flex gap-1">
        <div className="h-1 bg-white/30 flex-1 rounded overflow-hidden">
          <div className="h-full bg-white transition-all duration-50" style={{ width: `${storyProgress}%` }} />
        </div>
      </div>
      <div className="absolute top-8 left-4 flex items-center gap-2 z-10">
        <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center font-bold text-white text-xs">
          {viewingStory.user?.[0]}
        </div>
        <span className="text-white font-bold text-sm">{viewingStory.user}</span>
      </div>
      <button onClick={() => setViewingStory(null)} className="absolute top-8 right-4 text-white"><X size={24} /></button>
      <img src={viewingStory.image} className="max-h-full max-w-full object-contain" alt="Story" />
    </div>
  );
}
