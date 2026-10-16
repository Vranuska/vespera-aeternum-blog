export function Ornament({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center justify-center gap-4 text-gold ${className}`} aria-hidden="true">
      <span className="h-px w-16 bg-gold/50 sm:w-28" />
      <svg width="34" height="18" viewBox="0 0 34 18" fill="none" stroke="currentColor" strokeWidth="0.9">
        <path d="M17 1 L21 9 L17 17 L13 9 Z" />
        <path d="M1 9 C7 2, 10 2, 13 9 C10 16, 7 16, 1 9" />
        <path d="M33 9 C27 2, 24 2, 21 9 C24 16, 27 16, 33 9" />
        <circle cx="17" cy="9" r="1.2" fill="currentColor" />
      </svg>
      <span className="h-px w-16 bg-gold/50 sm:w-28" />
    </div>
  );
}

export function StarSigil({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 200 200" fill="none" stroke="currentColor" strokeWidth="0.5" aria-hidden="true">
      <circle cx="100" cy="100" r="96" />
      <circle cx="100" cy="100" r="80" strokeDasharray="1 4" />
      <path d="M100 8 L118 82 L192 100 L118 118 L100 192 L82 118 L8 100 L82 82 Z" />
      <path d="M100 40 L108 92 L160 100 L108 108 L100 160 L92 108 L40 100 L92 92 Z" />
      <circle cx="100" cy="100" r="3" fill="currentColor" />
    </svg>
  );
}
