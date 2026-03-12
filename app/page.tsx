import ChatBox from "./components/ChatBox";

export default function Home() {
  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden bg-zinc-950 text-zinc-50">
      {/* Background decorations */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-green-500/20 rounded-full blur-[120px] pointer-events-none" />

      <main className="z-10 flex flex-col items-center w-full max-w-4xl px-0 md:px-4 py-0 md:py-8 h-dvh md:h-auto">
        {/* Hide header on mobile for native app feel */}
        <header className="hidden md:block mb-4 md:mb-8 text-center animate-fade-in-up pt-4">
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight mb-1 md:mb-2 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 to-green-600">
            AgriMate AI
          </h1>
          <p className="text-muted-foreground md:text-base font-medium">
            Your intelligent assistant for maximizing crop yields 🌾
          </p>
        </header>

        <div className="w-full md:glass-panel bg-black/40 md:bg-white/5 rounded-none md:rounded-[2rem] overflow-hidden border-0 md:border border-white/10 shadow-none md:shadow-2xl h-full md:h-[600px] animate-fade-in-up md:border-emerald-500/10 md:shadow-emerald-900/20 flex flex-col" style={{ animationDelay: '0.1s' }}>
          <ChatBox />
        </div>
      </main>
    </div>
  );
}
