import ChatBox from "./components/ChatBox";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-background">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="z-10 flex flex-col items-center w-full max-w-4xl px-4 py-8">
        <header className="mb-4 md:mb-8 text-center animate-fade-in-up">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-1 md:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600">
            AgriMate AI
          </h1>
          <p className="text-muted-foreground text-xs md:text-base font-medium">
            Your intelligent assistant for maximizing crop yields 🌾
          </p>
        </header>

        <div className="w-full glass-panel rounded-xl md:rounded-[2rem] overflow-hidden border border-white/10 shadow-2xl h-[80vh] md:h-[600px] animate-fade-in-up border-emerald-500/10 shadow-emerald-900/20" style={{ animationDelay: '0.1s' }}>
          <ChatBox />
        </div>
      </main>
    </div>
  );
}
