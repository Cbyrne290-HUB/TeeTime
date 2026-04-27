export function Logo({ size = 36, showText = true }: { size?: number; showText?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      {/* Icon mark */}
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Outer circle */}
        <circle cx="20" cy="20" r="19" stroke="url(#logoGrad)" strokeWidth="1.5" fill="url(#logoBg)" />
        {/* Flag pin pole */}
        <line x1="16" y1="10" x2="16" y2="28" stroke="#e5e7eb" strokeWidth="1.6" strokeLinecap="round"/>
        {/* Flag */}
        <path d="M16 10 L25 13.5 L16 17 Z" fill="url(#flagGrad)"/>
        {/* Ground/cup */}
        <ellipse cx="16" cy="28.5" rx="4" ry="1.2" fill="url(#logoGrad)" opacity="0.6"/>
        {/* Golf ball */}
        <circle cx="26" cy="26" r="4.5" fill="url(#ballGrad)"/>
        {/* Ball shine */}
        <circle cx="24.5" cy="24.5" r="1.2" fill="white" opacity="0.5"/>
        {/* Dimple dots */}
        <circle cx="27" cy="24" r="0.4" fill="#ccc" opacity="0.5"/>
        <circle cx="25" cy="27" r="0.4" fill="#ccc" opacity="0.5"/>
        <circle cx="28" cy="27" r="0.4" fill="#ccc" opacity="0.5"/>
        <defs>
          <linearGradient id="logoGrad" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#f59e0b"/>
            <stop offset="1" stopColor="#d97706"/>
          </linearGradient>
          <linearGradient id="logoBg" x1="0" y1="0" x2="40" y2="40" gradientUnits="userSpaceOnUse">
            <stop stopColor="#0f1f0f"/>
            <stop offset="1" stopColor="#0a0f1e"/>
          </linearGradient>
          <linearGradient id="flagGrad" x1="16" y1="10" x2="25" y2="17" gradientUnits="userSpaceOnUse">
            <stop stopColor="#fbbf24"/>
            <stop offset="1" stopColor="#f59e0b"/>
          </linearGradient>
          <radialGradient id="ballGrad" cx="45%" cy="40%" r="55%">
            <stop stopColor="#f8f6f0"/>
            <stop offset="1" stopColor="#d4c9b0"/>
          </radialGradient>
        </defs>
      </svg>

      {showText && (
        <div className="leading-none">
          <div className="font-black text-white tracking-tight" style={{ fontSize: size * 0.45, letterSpacing: "-0.02em" }}>
            TeeTime
          </div>
          <div className="font-bold tracking-[0.18em] uppercase" style={{ fontSize: size * 0.22, color: "#f59e0b", marginTop: 1 }}>
            Ireland
          </div>
        </div>
      )}
    </div>
  );
}
