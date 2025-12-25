"use client";

import { Check, CheckCheck, Eye, Forward, Flame } from "lucide-react";
import SpoilerText from "./SpoilerText";
import Poll from "./Poll";
import TicTacToe from "./TicTacToe";

export default function MessageBubble({ message, isOwn, type = "private", onContextMenu, onGameMove, onVote, onReplyClick }) {
  const isText = message.type === "text";
  const isImage = message.type === "image";
  const isVideo = message.type === "video";
  const isPoll = message.type === "poll";
  const isGame = message.type === "game";
  const isSticker = message.type === "sticker";
  const isGif = message.type === "gif";

  return (
    <div 
      id={message.$id}
      className={`flex w-full mb-1 ${isOwn ? "justify-end" : "justify-start"} animate-message group`}
      onContextMenu={(e) => onContextMenu(e, message.$id)}
    >
      <div
        className={`relative max-w-[85%] px-3 py-1.5 shadow-sm text-[15px] rounded-lg ${
          isSticker || isGif 
            ? "bg-transparent shadow-none" 
            : isOwn
              ? "bg-message-out text-inverse rounded-tr-none"
              : "bg-message-in text-primary rounded-tl-none"
        }`}
      >
        {message.replyToId && (
          <div 
            onClick={() => onReplyClick(message.replyToId)}
            className={`mb-1 pl-2 border-l-2 text-xs opacity-80 cursor-pointer border-accent bg-black/5 dark:bg-white/10 rounded py-1 max-w-xs`}
            style={isOwn ? { borderColor: 'rgba(255,255,255,0.6)' } : {}}
          >
            <div className="font-bold">Reply</div>
            <div className="truncate">{message.replyToText}</div>
          </div>
        )}

        {message.isForwarded && (
          <div className="text-[11px] font-medium mb-1 flex items-center gap-1 opacity-70">
            <Forward size={12} /> Forwarded message
          </div>
        )}

        {message.selfDestructTime > 0 && (
          <div className="flex items-center gap-1 text-[10px] text-red-400 mb-1 font-bold">
            <Flame size={12} className="animate-pulse" /> Self-destructing
          </div>
        )}

        {isImage && (
          <div className="overflow-hidden rounded-lg mb-1">
            <img src={message.fileUrl} alt="Sent image" className="max-h-64 w-full object-cover" loading="lazy" />
          </div>
        )}

        {isSticker && <img src={message.fileUrl} className="w-32 h-32" alt="Sticker" />}
        
        {isGif && <img src={message.fileUrl} className="w-full max-w-[240px] rounded-lg object-cover" alt="GIF" />}

        {isVideo && (
          <div className="overflow-hidden rounded-lg mb-1">
            <video src={message.fileUrl} controls className="max-h-64 w-full" />
          </div>
        )}

        {isPoll && <Poll question={message.question} options={message.options || []} onVote={(optId) => onVote(message.$id, optId)} />}

        {isGame && <TicTacToe board={message.gameState?.board || []} xIsNext={message.gameState?.xIsNext} winner={message.gameState?.winner} onMove={(idx) => onGameMove(message.$id, idx)} />}

        {isText && <div className="mr-8 pb-1 inline-block break-words"><SpoilerText text={message.text} /></div>}

        <div className={`float-right flex items-center gap-1 ml-2 mt-2 select-none h-3 relative top-0.5 ${(isSticker || isGif) ? 'bg-black/20 text-white rounded px-1' : ''}`}>
          {message.isEdited && <span className="text-[10px] opacity-50">edited</span>}
          <span className={`text-[11px] ${isOwn ? "text-white/70" : "text-muted"}`}>
            {new Date(message.$createdAt || message.createdAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
          {isOwn && (message.status === "read" ? <CheckCheck className="w-3.5 h-3.5" /> : <Check className="w-3.5 h-3.5 opacity-70" />)}
        </div>

        {message.reactions?.length > 0 && (
          <div className={`absolute -bottom-5 ${isOwn ? 'right-0' : 'left-0'} flex gap-1 z-10`}>
            {message.reactions.map((r, i) => (
              <button key={i} className="bg-surface border border-default px-1.5 py-0.5 rounded-full text-[10px] shadow-sm flex items-center gap-1 text-primary">
                <span>{r.emoji}</span>
                {r.count > 1 && <span>{r.count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}