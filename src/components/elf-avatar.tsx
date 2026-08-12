import type { ElfProfile } from "@/lib/elves";
export function ElfAvatar({
  elf,
  size = 160,
  className = "",
}: {
  elf: ElfProfile;
  size?: number;
  className?: string;
}) {
  if (elf.portrait) {
    return (
      <div
        className={`relative overflow-hidden rounded-full border-4 shadow-[0_8px_24px_rgba(0,0,0,0.35)] ${className}`}
        style={{ width: size, height: size, borderColor: elf.hatColor }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={elf.portrait} alt={elf.name} className="h-full w-full object-cover" />
      </div>
    );
  }
  const hairPath =
    elf.hairStyle === "long"
      ? "M22 46 C18 78 24 108 34 118 L40 70 C70 128 110 120 128 70 L136 118 C146 100 150 70 146 46 Z"
      : elf.hairStyle === "braids"
        ? "M28 48 C24 80 40 100 46 118 L52 72 C78 110 108 100 116 70 L124 118 C138 96 144 70 140 48 Z"
        : elf.hairStyle === "spiky"
          ? "M26 58 L34 28 L48 52 L64 22 L78 50 L96 20 L110 50 L128 26 L138 58 Z"
          : "M24 56 C30 28 130 24 144 56 C120 44 40 44 24 56 Z";
  return (
    <div
      className={`relative ${className}`}
      style={{ width: size, height: size }}
      aria-label={elf.name}
    >
      <svg viewBox="0 0 160 160" width={size} height={size} role="img">
        <defs>
          <radialGradient id={`bg-${elf.id}`} cx="50%" cy="40%" r="60%">
            <stop offset="0%" stopColor={elf.accentColor} stopOpacity="0.85" />
            <stop offset="100%" stopColor={elf.hatColor} stopOpacity="0.9" />
          </radialGradient>
        </defs>
        <circle cx="80" cy="80" r="76" fill={`url(#bg-${elf.id})`} />
        <circle cx="80" cy="80" r="72" fill="none" stroke="rgba(255,246,229,0.45)" strokeWidth="3" />
        <ellipse cx="80" cy="128" rx="46" ry="18" fill={elf.hatColor} />
        <path d="M48 118 Q80 148 112 118 Q104 132 80 136 Q56 132 48 118 Z" fill={elf.accentColor} />
        <path d="M36 78 Q28 70 22 86 Q30 90 38 86 Z" fill={elf.skin} />
        <path d="M124 78 Q132 70 138 86 Q130 90 122 86 Z" fill={elf.skin} />
        <circle cx="80" cy="84" r="34" fill={elf.skin} />
        <path d={hairPath} fill={elf.hair} />
        <path d="M44 18 L80 78 L116 18 L96 8 L80 28 L64 8 Z" fill={elf.hatColor} />
        <ellipse cx="80" cy="20" rx="38" ry="10" fill="#f4efe4" />
        <circle cx="80" cy="12" r="8" fill={elf.accentColor} stroke="#d4af37" />
        <circle cx="68" cy="84" r="4.2" fill={elf.eyes} />
        <circle cx="92" cy="84" r="4.2" fill={elf.eyes} />
        <circle cx="69.4" cy="82.8" r="1.3" fill="white" />
        <circle cx="93.4" cy="82.8" r="1.3" fill="white" />
        <ellipse cx="66" cy="92" rx="5" ry="3" fill="#f0a3a3" opacity="0.7" />
        <ellipse cx="94" cy="92" rx="5" ry="3" fill="#f0a3a3" opacity="0.7" />
        <path d="M72 100 Q80 108 88 100" fill="none" stroke="#8a3a2a" strokeWidth="2.2" strokeLinecap="round" />
        {elf.accessory === "glasses" && (
          <>
            <circle cx="68" cy="84" r="8" fill="none" stroke="#2b1a12" strokeWidth="2" />
            <circle cx="92" cy="84" r="8" fill="none" stroke="#2b1a12" strokeWidth="2" />
            <path d="M76 84 H84" stroke="#2b1a12" strokeWidth="2" />
          </>
        )}
        {elf.accessory === "scarf" && (
          <path d="M54 118 Q80 136 106 118 L110 150 L98 140 L80 132 L70 148 L62 132 Z" fill="#c41e3a" />
        )}
        {elf.accessory === "holly" && (
          <>
            <ellipse cx="54" cy="28" rx="8" ry="4" fill="#1b6b4a" transform="rotate(-20 54 28)" />
            <circle cx="58" cy="32" r="2.4" fill="#c41e3a" />
            <circle cx="62" cy="30" r="2.4" fill="#c41e3a" />
          </>
        )}
        {elf.accessory === "bells" && (
          <g>
            <circle cx="80" cy="44" r="5" fill="#f4d03f" />
            <circle cx="80" cy="46" r="1.4" fill="#6d4c12" />
          </g>
        )}
        {elf.accessory === "star" && (
          <path d="M80 6 L83 14 H91 L84 19 L87 27 L80 22 L73 27 L76 19 L69 14 H77 Z" fill="#f4d03f" />
        )}
      </svg>
    </div>
  );
}
