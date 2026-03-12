"use client";

import { useState, useRef } from "react";
import Message from "./Message";
import VoiceInput from "./VoiceInput";

type ChatMessage = {
  role: "user" | "ai";
  text: string;
  image?: string;
};

export default function ChatBox() {
  const [message, setMessage] = useState("");
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [chat, setChat] = useState<ChatMessage[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: "environment" } // Prefer back camera for farmers
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setIsCameraActive(true);
    } catch (err) {
      console.error("Error accessing camera:", err);
      alert("Could not access the camera. Please ensure permissions are granted.");
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    setIsCameraActive(false);
  };

  const capturePhoto = () => {
    if (videoRef.current && canvasRef.current) {
      const context = canvasRef.current.getContext('2d');
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(videoRef.current, 0, 0);
        const imageDataUrl = canvasRef.current.toDataURL('image/jpeg');
        setSelectedImage(imageDataUrl);
        stopCamera();
      }
    }
  };

  const sendMessage = async () => {
    if (!message && !selectedImage) return;

    const userMsg: ChatMessage = { role: "user", text: message, image: selectedImage || undefined };

    setChat((prev) => [...prev, userMsg]);
    setMessage(""); // Clear input immediately for better UX
    const imagePayload = selectedImage;
    setSelectedImage(null); // Clear image immediately

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        body: JSON.stringify({ message, image: imagePayload }),
      });

      const data = await res.json();

      const aiMsg: ChatMessage = { role: "ai", text: data.reply };

      setChat((prev) => [...prev, aiMsg]);
    } catch (error) {
      console.error("Error sending message:", error);
      // Optional: Add error handling UI state
    }
  };

  const newChat = () => {
    setChat([]);
    setSelectedImage(null);
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="flex flex-col h-full bg-white/5 backdrop-blur-sm">
      {/* Header Bar */}
      <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-white/10 bg-black/20">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs md:text-sm font-medium text-white/90">AgriMate Online</span>
        </div>
        <button 
          onClick={newChat} 
          className="px-3 py-1.5 md:px-4 md:py-2 text-xs md:text-sm font-medium text-white transition-all rounded-full bg-white/10 hover:bg-emerald-500/20 active:scale-95 border border-white/5 hover:border-emerald-500/20"
        >
          New Chat
        </button>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-4 md:p-6 overflow-y-auto scrollbar-custom flex flex-col gap-4 md:gap-6 relative">
        {isCameraActive ? (
          <div className="absolute inset-4 md:inset-6 z-20 flex flex-col bg-black/90 rounded-2xl overflow-hidden border border-emerald-500/30 animate-fade-in-up">
            <video 
              ref={videoRef} 
              autoPlay 
              playsInline 
              className="flex-1 object-cover w-full h-full bg-black/50"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-black/80 to-transparent flex items-center justify-between">
              <button 
                onClick={stopCamera}
                className="px-4 py-2 text-sm text-white bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-md"
              >
                Cancel
              </button>
              <button 
                onClick={capturePhoto}
                className="w-14 h-14 md:w-16 md:h-16 rounded-full bg-emerald-500 border-4 border-white shadow-lg flex items-center justify-center hover:bg-emerald-400 active:scale-95 transition-all"
                aria-label="Capture photo"
              >
                <div className="w-10 h-10 md:w-12 md:h-12 border-2 border-white rounded-full bg-transparent" />
              </button>
              <div className="w-[72px]" /> {/* Spacer for centering */}
            </div>
          </div>
        ) : chat.length === 0 ? (
           <div className="flex flex-col items-center justify-center h-full text-center opacity-70 animate-fade-in-up px-4">
              <div className="w-12 h-12 md:w-16 md:h-16 mb-4 rounded-xl bg-gradient-to-tr from-emerald-500/20 to-yellow-500/20 flex items-center justify-center border border-emerald-500/20">
                 <svg className="w-6 h-6 md:w-8 md:h-8 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
              </div>
              <p className="text-base md:text-lg font-medium text-white">How can I help boost your farm's yield?</p>
              <p className="text-xs md:text-sm text-white/50 mt-1 max-w-[200px] md:max-w-[280px]">Ask questions about crop diseases, pest control, or weather forecasting to get started.</p>
           </div>
        ) : (
          chat.map((msg, index) => (
            <Message key={index} role={msg.role} text={msg.text} image={msg.image} />
          ))
        )}
      </div>

      {/* Input Area */}
      <div className="p-3 md:p-4 border-t border-white/10 bg-black/30 backdrop-blur-md">
        {selectedImage && (
          <div className="relative inline-block mb-3 ml-2 group animate-fade-in-up">
            <img src={selectedImage} alt="Preview" className="h-16 w-16 object-cover rounded-lg border border-emerald-500/30" />
            <button 
              onClick={() => setSelectedImage(null)}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs opacity-0 group-hover:opacity-100 transition-opacity"
            >
              ✕
            </button>
          </div>
        )}
        <div className="flex items-center gap-2 md:gap-3 p-1.5 md:p-2 bg-black/40 border border-white/10 rounded-2xl md:rounded-3xl focus-within:border-emerald-500/30 focus-within:ring-1 focus-within:ring-emerald-500/20 transition-all">
          <input
            type="file"
            accept="image/*"
            className="hidden"
            ref={fileInputRef}
            onChange={handleImageUpload}
          />
          <div className="flex items-center ml-1">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="p-2 md:p-2.5 text-white/70 hover:text-white hover:bg-white/10 rounded-xl transition-all flex items-center justify-center"
              title="Upload photo from gallery"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </button>
            <button
              onClick={startCamera}
              className="p-2 md:p-2.5 text-white/70 hover:text-emerald-400 hover:bg-white/10 rounded-xl transition-all flex items-center justify-center"
              title="Take photo of crop"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
            </button>
          </div>

          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Ask anything about farming..."
            className="flex-1 px-1 py-2 bg-transparent text-white placeholder-white/40 focus:outline-none text-sm md:text-base w-full min-w-0"
          />

          <div className="flex items-center gap-1 md:gap-2 pr-1 md:pr-2 shrink-0">
            <VoiceInput setMessage={setMessage} />

            <button 
              onClick={sendMessage} 
              disabled={!message.trim() && !selectedImage}
              className="flex items-center justify-center p-2 md:p-2.5 transition-all rounded-xl md:rounded-2xl bg-gradient-to-r from-emerald-500 to-green-600 text-white hover:opacity-90 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed group"
              aria-label="Send message"
            >
              <svg 
                className="w-4 h-4 md:w-5 md:h-5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                fill="none" stroke="currentColor" viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
