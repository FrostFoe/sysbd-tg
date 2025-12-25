"use client";

import { useUI } from "@/context/UIContext";
import { useAuth } from "@/context/AuthContext";
import { X, Trash2, Send } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import { mediaService } from "@/lib/media";
import { chatService } from "@/lib/chat";
import { useParams } from "next/navigation";

export default function DrawingModal() {
  const { isDrawingOpen, setIsDrawingOpen, accentColor } = useUI();
  const { user } = useAuth();
  const { chatId } = useParams();
  const [isSendingDrawing, setIsSendingDrawing] = useState(false);
  const [drawingColor, setDrawingColor] = useState("#000000");
  const [isDrawing, setIsDrawing] = useState(false);
  const canvasRef = useRef(null);
  const contextRef = useRef(null);

  useEffect(() => {
    if (isDrawingOpen && canvasRef.current) {
      const canvas = canvasRef.current;
      canvas.width = canvas.offsetWidth * 2;
      canvas.height = canvas.offsetHeight * 2;
      const ctx = canvas.getContext("2d");
      ctx.scale(2, 2);
      ctx.lineCap = "round";
      ctx.strokeStyle = drawingColor;
      ctx.lineWidth = 3;
      contextRef.current = ctx;
    }
  }, [isDrawingOpen, drawingColor]);

  if (!isDrawingOpen) return null;

  const startDrawing = ({ nativeEvent }) => {
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.beginPath();
    contextRef.current.moveTo(offsetX, offsetY);
    setIsDrawing(true);
  };

  const draw = ({ nativeEvent }) => {
    if (!isDrawing) return;
    const { offsetX, offsetY } = nativeEvent;
    contextRef.current.lineTo(offsetX, offsetY);
    contextRef.current.stroke();
  };

  const endDrawing = () => {
    contextRef.current.closePath();
    setIsDrawing(false);
  };

  const handleSendDrawing = async () => {
    if (!canvasRef.current || !chatId || isSendingDrawing) return;
    
    try {
      setIsSendingDrawing(true);
      const canvas = canvasRef.current;
      const blob = await new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
      const { fileId, fileUrl } = await mediaService.uploadBlob(blob);
      await chatService.sendMediaMessage(chatId, user?.$id, fileId, fileUrl, "image");
      setIsDrawingOpen(false);
    } catch (error) {
      console.error("Failed to send drawing:", error);
      alert("Failed to send drawing");
    } finally {
      setIsSendingDrawing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/80 flex flex-col items-center justify-center p-4">
      <div className="bg-white dark:bg-[#212121] rounded-xl overflow-hidden shadow-2xl flex flex-col relative w-full max-w-lg animate-in zoom-in duration-200">
        <div className="absolute top-2 right-2 flex gap-2">
          <button onClick={() => contextRef.current.clearRect(0, 0, 1000, 1000)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full text-red-500 hover:bg-red-50 transition"><Trash2 size={20} /></button>
          <button onClick={() => setIsDrawingOpen(false)} className="p-2 bg-gray-100 dark:bg-gray-800 rounded-full dark:text-white transition"><X size={20} /></button>
        </div>
        <canvas
          ref={canvasRef}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={endDrawing}
          onMouseLeave={endDrawing}
          className="cursor-crosshair bg-white w-full h-[400px] touch-none"
        />
        <div className="p-4 bg-gray-100 dark:bg-[#1c1c1d] flex justify-between items-center">
          <div className="flex gap-2">
            {["#000000", "#ef4444", "#22c55e", "#3b82f6", "#eab308"].map((c) => (
              <button
                key={c}
                onClick={() => setDrawingColor(c)}
                className={`w-8 h-8 rounded-full border-2 transition ${drawingColor === c ? "border-gray-600 scale-110" : "border-white dark:border-gray-700"}`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
          <button 
            onClick={handleSendDrawing}
            disabled={isSendingDrawing}
            className="px-6 py-2 bg-accent text-white rounded-full font-bold flex items-center gap-2 transition hover:opacity-90 disabled:opacity-50"
          >
            {isSendingDrawing ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <><Send size={18} /> Send</>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
