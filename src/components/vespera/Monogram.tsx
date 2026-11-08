export function Monogram({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 64 64" fill="none" stroke="currentColor" aria-hidden="true">
      <circle cx="32" cy="32" r="30" strokeWidth="1" />
      <circle cx="32" cy="32" r="26.5" strokeWidth="0.5" strokeDasharray="1 2.5" />
      <path d="M17 16 L32 50 L47 16" strokeWidth="3" strokeLinejoin="miter" />
      <path d="M13 16 h9 M42 16 h9" strokeWidth="1.4" />
      <path d="M32 50 C27 44 21 43 16 45 C20 48 26 49 32 50 Z M32 50 C37 44 43 43 48 45 C44 48 38 49 32 50 Z" fill="currentColor" strokeWidth="0.4" />
      <path d="M32 10 C29 13 29 16 32 19 C35 16 35 13 32 10 Z" fill="currentColor" strokeWidth="0.4" />
      <path d="M24 30 C20 28 18 25 19 22 M40 30 C44 28 46 25 45 22" strokeWidth="0.8" />
    </svg>
  );
}