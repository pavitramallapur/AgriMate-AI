type Props = {
  role: string;
  text: string;
  image?: string;
};

export default function Message({ role, text, image }: Props) {
  const isUser = role === "user";
  
  return (
    <div className={`flex w-full animate-fade-in-up ${isUser ? "justify-end" : "justify-start"}`}>
      {/* AI Avatar */}
      {!isUser && (
        <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 mr-2 md:mr-3 rounded-full bg-gradient-to-tr from-emerald-600/20 to-green-600/20 flex items-center justify-center border border-emerald-500/20 mt-1">
          <svg className="w-3 h-3 md:w-4 md:h-4 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
        </div>
      )}
      
      <div 
        className={`relative max-w-[85%] sm:max-w-[75%] px-3 py-2 md:px-4 md:py-3 text-sm md:text-base leading-relaxed break-words shadow-sm flex flex-col gap-2
          ${isUser 
            ? "bg-gradient-to-br from-emerald-500 to-green-600 text-white rounded-2xl rounded-tr-sm" 
            : "bg-white/10 text-white/90 backdrop-blur-md border border-white/5 rounded-2xl rounded-tl-sm hover:bg-white/15 transition-colors"
          }`}
      >
        {image && (
          <img 
            src={image} 
            alt="Uploaded crop photo" 
            className="w-full max-w-sm rounded-xl object-cover mb-1 border border-white/10" 
          />
        )}
        {text && <span>{text}</span>}
      </div>
      
      {/* User Avatar */}
      {isUser && (
        <div className="flex-shrink-0 w-6 h-6 md:w-8 md:h-8 ml-2 md:ml-3 rounded-full bg-gradient-to-tr from-green-500 to-emerald-500 flex items-center justify-center border border-white/10 mt-1 shadow-lg shadow-emerald-500/20">
          <span className="text-[10px] md:text-xs font-bold text-white">FM</span>
        </div>
      )}
    </div>
  );
}
