export function WindowFrame() {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {/* Window frame overlay */}
      <div className="absolute inset-0">
        {/* Top frame */}
        <div className="absolute top-0 left-0 right-0 h-12 bg-gradient-to-b from-slate-900/20 to-transparent" />
        
        {/* Bottom frame */}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-slate-900/20 to-transparent" />
        
        {/* Left frame */}
        <div className="absolute top-0 bottom-0 left-0 w-8 bg-gradient-to-r from-slate-900/15 to-transparent" />
        
        {/* Right frame */}
        <div className="absolute top-0 bottom-0 right-0 w-8 bg-gradient-to-l from-slate-900/15 to-transparent" />

        {/* Subtle window divider (vertical center) */}
        <div className="absolute top-0 bottom-0 left-1/2 w-1 bg-slate-400/5 transform -translate-x-1/2" />
      </div>

      {/* Corner details */}
      <div className="absolute top-4 left-4 w-3 h-3 border-t-2 border-l-2 border-slate-300/20 rounded-tl-lg" />
      <div className="absolute top-4 right-4 w-3 h-3 border-t-2 border-r-2 border-slate-300/20 rounded-tr-lg" />
      <div className="absolute bottom-4 left-4 w-3 h-3 border-b-2 border-l-2 border-slate-300/20 rounded-bl-lg" />
      <div className="absolute bottom-4 right-4 w-3 h-3 border-b-2 border-r-2 border-slate-300/20 rounded-br-lg" />
    </div>
  );
}
