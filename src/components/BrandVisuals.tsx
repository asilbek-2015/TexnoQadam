import React, { useState } from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showKursBor?: boolean;
  darkText?: boolean;
}

export const TexnoQadamLogo: React.FC<LogoProps> = ({
  size = 'md',
  showKursBor = true,
  darkText = false,
}) => {
  const dimensions = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  return (
    <div className="inline-flex items-center gap-2.5 select-none group">
      {/* Exact Circular TQ Logo Emblem matching TexnoQadam_Logo.png */}
      <div
        className={`${dimensions} relative shrink-0 rounded-full bg-white shadow-md ring-2 ring-orange-500/30 flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}
      >
        <svg viewBox="0 0 120 120" className="w-full h-full" aria-label="TexnoQadam Logo">
          <defs>
            <linearGradient id="tqOrangeRing" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FB923C" />
              <stop offset="50%" stopColor="#F97316" />
              <stop offset="100%" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="tqDarkT" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#334155" />
              <stop offset="50%" stopColor="#1E293B" />
              <stop offset="100%" stopColor="#0F172A" />
            </linearGradient>
            <filter id="tqShadow" x="-10%" y="-10%" width="125%" height="125%">
              <feDropShadow dx="0" dy="2" stdDeviation="1.5" floodOpacity="0.18" />
            </filter>
          </defs>

          {/* White Circle Base + Orange 3D Ring */}
          <circle cx="60" cy="60" r="55" fill="#FFFFFF" stroke="url(#tqOrangeRing)" strokeWidth="7" />

          {/* 3D Dark T with angled right tip */}
          <path
            d="M 24 34 L 68 30 L 59 42 L 47 43 L 47 74 L 36 76 L 36 44 L 21 45 Z"
            fill="url(#tqDarkT)"
            filter="url(#tqShadow)"
          />

          {/* 3D Orange Q Ring */}
          <path
            d="M 74 35 C 58 35 48 46 48 59 C 48 72 58 82 73 82 C 76 82 78 81.5 80 81 L 75 72 C 74 72.3 73 72.5 72 72.5 C 63 72.5 58 66.5 58 59 C 58 51.5 63 45 73 45 C 83 45 88 51.5 88 59 C 88 62 87 65 85 67.5 L 93 73 C 96.5 69 98 64 98 59 C 98 46 88 35 74 35 Z"
            fill="url(#tqOrangeRing)"
            filter="url(#tqShadow)"
          />

          {/* Cursor Arrow inside Q */}
          <path
            d="M 72 56 L 95 68 L 86 72 L 91 80 L 85 83 L 80 75 L 75 81 Z"
            fill="url(#tqOrangeRing)"
            filter="url(#tqShadow)"
          />

          {/* TexnoQadam Micro Text inside emblem */}
          <text
            x="60"
            y="97"
            textAnchor="middle"
            fontSize="11.5"
            fontWeight="800"
            fontFamily="Plus Jakarta Sans, sans-serif"
          >
            <tspan fill="#0F172A">Texno</tspan>
            <tspan fill="#EA580C">Qadam</tspan>
          </text>
        </svg>
      </div>

      {/* Brand Wordmark */}
      <div className="flex flex-col leading-none">
        <div className="flex items-center gap-1.5">
          <span
            className={`font-extrabold tracking-tight ${
              size === 'sm' ? 'text-base' : size === 'lg' ? 'text-xl' : 'text-lg'
            } ${darkText ? 'text-white' : 'text-slate-900'}`}
          >
            Texno<span className="text-orange-500">Qadam</span>
          </span>
        </div>
        {showKursBor && (
          <span
            className={`text-[11px] font-bold tracking-wider uppercase mt-0.5 ${
              darkText ? 'text-orange-400' : 'text-orange-600'
            }`}
          >
            Kurs Bor
          </span>
        )}
      </div>
    </div>
  );
};

export type RobotPose = 'welcome' | 'coding' | 'celebrating' | 'thinking';

export const ROBOT_POSE_IMAGES: Record<RobotPose, string> = {
  welcome: '/src/assets/images/robot_welcome_pose_1790790227678.jpg',
  coding: '/src/assets/images/robot_coding_pose_1790790244369.jpg',
  celebrating: '/src/assets/images/robot_celebrating_pose_1790790262093.jpg',
  thinking: '/src/assets/images/robot_thinking_pose_1790790276873.jpg',
};

export const ROBOT_POSE_CAPTIONS: Record<RobotPose, { title: string; badge: string }> = {
  welcome: { title: 'TexnoBot — Salomlashuv pozasi', badge: 'Xush kelibsiz!' },
  coding: { title: 'TexnoBot — Dasturlash pozasi', badge: 'Kod yozamiz!' },
  celebrating: { title: 'TexnoBot — G‘alaba pozasi', badge: '+Coin & +Point!' },
  thinking: { title: 'TexnoBot — Ustoz pozasi', badge: 'Yangi bilim!' },
};

interface RobotMascotProps {
  pose?: RobotPose;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  caption?: string;
  className?: string;
  interactivePoseSwitch?: boolean;
}

export const RobotMascot: React.FC<RobotMascotProps> = ({
  pose = 'welcome',
  size = 'md',
  caption,
  className = '',
  interactivePoseSwitch = false,
}) => {
  const [activePose, setActivePose] = useState<RobotPose>(pose);
  const [imgFailed, setImgFailed] = useState(false);

  const currentPose = interactivePoseSwitch ? activePose : pose;

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-28 h-28',
    lg: 'w-40 h-40',
    xl: 'w-56 h-56',
  }[size];

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div
        className={`${sizeClasses} relative rounded-2xl overflow-hidden bg-white shadow-lg ring-2 ring-orange-500/25 flex items-center justify-center group`}
      >
        {!imgFailed ? (
          <img
            src={ROBOT_POSE_IMAGES[currentPose]}
            alt={ROBOT_POSE_CAPTIONS[currentPose].title}
            referrerPolicy="no-referrer"
            onError={() => setImgFailed(true)}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* High-precision SVG Fallback of the White & Orange TQ Robot Mascot */
          <svg viewBox="0 0 200 200" className="w-full h-full p-2">
            <circle cx="100" cy="100" r="90" fill="#FFF7ED" />
            {/* Robot Head Helmet */}
            <rect x="45" y="28" width="110" height="82" rx="40" fill="#FFFFFF" stroke="#EA580C" strokeWidth="5" />
            <path d="M 75 28 Q 100 38 125 28" fill="#F97316" />
            {/* Orange Earpieces */}
            <ellipse cx="42" cy="68" rx="8" ry="18" fill="#F97316" />
            <ellipse cx="158" cy="68" rx="8" ry="18" fill="#F97316" />
            {/* Black Visor Screen */}
            <rect x="58" y="42" width="84" height="54" rx="22" fill="#0F172A" />
            {/* Glowing Orange Happy Eyes & Smile */}
            <path d="M 72 66 Q 80 54 88 66" stroke="#FB923C" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 112 66 Q 120 54 128 66" stroke="#FB923C" strokeWidth="5" fill="none" strokeLinecap="round" />
            <path d="M 90 79 Q 100 88 110 79" stroke="#FB923C" strokeWidth="4.5" fill="none" strokeLinecap="round" />
            {/* Robot Torso with TQ Logo */}
            <rect x="64" y="116" width="72" height="56" rx="20" fill="#FFFFFF" stroke="#F97316" strokeWidth="4" />
            <text x="100" y="146" textAnchor="middle" fontSize="18" fontWeight="900" fill="#0F172A">
              T<tspan fill="#EA580C">Q</tspan>
            </text>
            {/* Signboard */}
            <rect x="40" y="156" width="120" height="28" rx="8" fill="#FFFFFF" stroke="#F97316" strokeWidth="3" />
            <text x="100" y="174" textAnchor="middle" fontSize="12" fontWeight="800">
              <tspan fill="#0F172A">Texno</tspan>
              <tspan fill="#EA580C">Qadam</tspan>
            </text>
          </svg>
        )}

        {/* Pose Badge */}
        <span className="absolute bottom-1.5 right-1.5 bg-slate-900/85 backdrop-blur-xs text-white text-[10px] font-semibold px-2 py-0.5 rounded-md border border-orange-400/40">
          {caption || ROBOT_POSE_CAPTIONS[currentPose].badge}
        </span>
      </div>

      {interactivePoseSwitch && (
        <div className="flex items-center gap-1 mt-2 bg-white/90 backdrop-blur-xs p-1 rounded-xl border border-slate-200 shadow-xs">
          {(['welcome', 'coding', 'celebrating', 'thinking'] as RobotPose[]).map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => {
                setImgFailed(false);
                setActivePose(p);
              }}
              className={`px-2 py-1 text-[11px] font-semibold rounded-lg transition-colors whitespace-nowrap ${
                currentPose === p
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:bg-orange-50 hover:text-orange-600'
              }`}
            >
              {p === 'welcome' && '👋 Salom'}
              {p === 'coding' && '💻 Kod'}
              {p === 'celebrating' && '🏆 G‘olib'}
              {p === 'thinking' && '💡 Ustoz'}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
