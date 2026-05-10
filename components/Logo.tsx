export function Logo({ size = 36, showText = true, dark = false }: { size?: number; showText?: boolean; dark?: boolean }) {
  const textColor = dark ? "#0a0a0a" : "#ffffff";
  const subColor = dark ? "#166534" : "#22c55e";

  return (
    <div className="flex items-center gap-2.5">
      <svg width={size} height={size} viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="20" r="19" fill={dark ? "#f0fdf4" : "#0f3d22"} stroke="#166534" strokeWidth="1.5" />
        <line x1="16" y1="10" x2="16" y2="28" stroke={dark ? "#166534" : "#e5e7eb"} strokeWidth="1.6" strokeLinecap="round"/>
        <path d="M16 10 L25 13.5 L16 17 Z" fill="#dc2626"/>
        <ellipse cx="16" cy="28.5" rx="4" ry="1.2" fill="#166534" opacity="0.6"/>
        <circle cx="26" cy="26" r="4.5" fill="url(#ballGradLogo)"/>
        <circle cx="24.5" cy="24.5" r="1.2" fill="white" opacity="0.6"/>
        <circle cx="27" cy="24" r="0.4" fill="#ccc" opacity="0.5"/>
        <circle cx="25" cy="27" r="0.4" fill="#ccc" opacity="0.5"/>
        <circle cx="28" cy="27" r="0.4" fill="#ccc" opacity="0.5"/>
        <defs>
          <radialGradient id="ballGradLogo" cx="40%" cy="35%" r="55%">
            <stop stopColor="#f8f6f0"/>
            <stop offset="1" stopColor="#d4c9b0"/>
          </radialGradient>
        </defs>
      </svg>

      {showText && (
        <div className="leading-none">
          <div className="font-black tracking-tight" style={{ fontSize: size * 0.45, letterSpacing: "-0.02em", color: textColor }}>
            TeeTime
          </div>
          <div className="font-bold tracking-[0.16em] uppercase" style={{ fontSize: size * 0.22, color: subColor, marginTop: 1 }}>
            Ireland
          </div>
        </div>
      )}
    </div>
  );
}
