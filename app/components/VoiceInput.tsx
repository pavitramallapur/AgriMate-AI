"use client";
import { useState } from "react";

type Props = {
  setMessage: (text: string) => void;
};

declare global {
  interface Window {
    webkitSpeechRecognition: {
      new (): SpeechRecognition;
    };
  }
}

export default function VoiceInput({ setMessage }: Props) {
  const [isListening, setIsListening] = useState(false);

  const startVoice = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert("Your browser doesn't support speech recognition.");
      return;
    }
    
    const recognition = new window.webkitSpeechRecognition();
    recognition.lang = "en-US";
    
    recognition.onstart = () => setIsListening(true);
    recognition.onend = () => setIsListening(false);
    recognition.onerror = () => setIsListening(false);

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const text = event.results[0][0].transcript;
      setMessage(text);
    };

    try {
      recognition.start();
    } catch (e) {
      console.error(e);
      setIsListening(false);
    }
  };

  return (
    <button
      onClick={startVoice}
      className={`relative flex items-center justify-center p-2.5 transition-all rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/50 group
        ${isListening 
          ? "bg-red-500/20 text-red-400 hover:bg-red-500/30 auto-pulse" 
          : "bg-white/5 text-white/70 hover:bg-white/10 hover:text-white"
        }`}
      aria-label="Voice input"
      type="button"
    >
      {isListening && (
        <span className="absolute inset-0 rounded-xl bg-red-400/20 animate-ping" />
      )}
      <svg 
        className={`w-5 h-5 transition-transform ${isListening ? "scale-110" : "group-hover:scale-110"}`} 
        fill="none" stroke="currentColor" viewBox="0 0 24 24"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
      </svg>
    </button>
  );
}
