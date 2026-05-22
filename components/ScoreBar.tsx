export function ScoreBar({ label, score }: { label: string; score: number }) {
  // Score 0-100
  const width = `${Math.max(0, Math.min(100, score))}%`;
  
  return (
    <div>
      <div className="flex justify-between text-xs font-display tracking-widest uppercase mb-2">
        <span className="opacity-80">{label}</span>
        <span className="opacity-40">{score}/100</span>
      </div>
      <div className="h-1 w-full bg-paper-3 overflow-hidden relative group">
        <div 
          className="absolute top-0 left-0 h-full bg-accent transition-all duration-[1000ms] ease-out origin-left"
          style={{ width }}
        />
      </div>
    </div>
  );
}
