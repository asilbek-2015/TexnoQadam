import React, { useState } from 'react';
import { PREDEFINED_AVATARS } from '../translations';

export const ROBOT_IMAGES: Record<'welcome' | 'coding' | 'celebrating' | 'thinking', string> = {
  welcome: '/src/assets/images/robot_welcome_pose_1790790227678.jpg',
  coding: '/src/assets/images/robot_coding_pose_1790790244369.jpg',
  celebrating: '/src/assets/images/robot_celebrating_pose_1790790262093.jpg',
  thinking: '/src/assets/images/robot_thinking_pose_1790790276873.jpg',
};

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  showKursBorSub?: boolean;
  darkText?: boolean;
}

export const TexnoQadamLogo: React.FC<LogoProps> = ({
  size = 'md',
  showText = true,
  showKursBorSub = true,
  darkText = true,
}) => {
  const dims = {
    sm: 'w-9 h-9',
    md: 'w-11 h-11',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
  }[size];

  return (
    <div className="inline-flex items-center gap-2.5 select-none group">
      {/* Circular Orange Ring + Dark T + Orange Cursor Q + TexnoQadam */}
      <div className={`${dims} relative shrink-0 rounded-full bg-white shadow-sm flex items-center justify-center transition-transform duration-200 group-hover:scale-105`}>
        <svg viewBox="0 0 120 120" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Outer Orange Ring */}
          <circle cx="60" cy="60" r="55" stroke="url(#tqOrangeGrad)" strokeWidth="6" fill="#FFFFFF" />
          {/* Bold Dark T with angled right tip */}
          <path
            d="M20 34L68 28L58 41H47V75L36 72V41H18L20 34Z"
            fill="url(#tqDarkGrad)"
          />
          {/* Orange Q with Cursor Arrow */}
          <path
            d="M76 34C61.6 34 50 45.2 50 59C50 72.8 61.6 84 76 84C79.5 84 82.8 83.3 85.8 82.1L78 69.5C77.3 69.7 76.7 69.8 76 69.8C69.4 69.8 64 64.9 64 59C64 53.1 69.4 48.2 76 48.2C82.6 48.2 88 53.1 88 59C88 61.8 86.8 64.4 84.9 66.3L95.2 73.5C99.4 69.4 102 64.4 102 59C102 45.2 90.4 34 76 34Z"
            fill="url(#tqOrangeGrad)"
          />
          {/* Cursor pointer inside Q */}
          <path
            d="M72 56L96 68L88 73L94 81L89 85L83 77L77 82L72 56Z"
            fill="url(#tqOrangeCursor)"
          />
          {/* Micro text inside circle bottom */}
          <text x="60" y="99" textAnchor="middle" fontSize="11.5" fontWeight="800" fontFamily="Plus Jakarta Sans, sans-serif">
            <tspan fill="#111827">Texno</tspan>
            <tspan fill="#FF6B00">Qadam</tspan>
          </text>
          <defs>
            <linearGradient id="tqOrangeGrad" x1="50" y1="25" x2="105" y2="95" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF8A00" />
              <stop offset="1" stopColor="#EA580C" />
            </linearGradient>
            <linearGradient id="tqOrangeCursor" x1="72" y1="56" x2="96" y2="85" gradientUnits="userSpaceOnUse">
              <stop stopColor="#FF9E00" />
              <stop offset="1" stopColor="#FF5500" />
            </linearGradient>
            <linearGradient id="tqDarkGrad" x1="20" y1="28" x2="55" y2="75" gradientUnits="userSpaceOnUse">
              <stop stopColor="#334155" />
              <stop offset="1" stopColor="#0F172A" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {showText && (
        <div className="flex flex-col leading-none">
          <span className="text-lg sm:text-xl font-extrabold tracking-tight whitespace-nowrap">
            <span className={darkText ? 'text-slate-900' : 'text-white'}>Texno</span>
            <span className="text-[#FF6B00]">Qadam</span>
          </span>
          {showKursBorSub && (
            <span className={`text-[11px] font-semibold tracking-wide mt-0.5 whitespace-nowrap ${darkText ? 'text-slate-500' : 'text-slate-300'}`}>
              Kurs Bor Platformasi
            </span>
          )}
        </div>
      )}
    </div>
  );
};

interface RobotProps {
  pose: 'welcome' | 'coding' | 'celebrating' | 'thinking';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  caption?: string;
  className?: string;
}

export const TexnoQadamRobot: React.FC<RobotProps> = ({
  pose,
  size = 'md',
  caption,
  className = '',
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: 'w-16 h-16',
    md: 'w-24 h-24',
    lg: 'w-36 h-36',
    xl: 'w-48 h-48',
  }[size];

  const poseLabels: Record<typeof pose, string> = {
    welcome: 'Salom! TexnoQadam',
    coding: 'Kod yozamiz!',
    celebrating: 'Barakalla! +Coin',
    thinking: 'Bilim kuchdir!',
  };

  return (
    <div className={`inline-flex flex-col items-center ${className}`}>
      <div
        className={`${sizeClasses} relative rounded-2xl overflow-hidden bg-white border-2 border-orange-200 shadow-md flex items-center justify-center transition-transform duration-200 hover:-translate-y-0.5`}
      >
        {!imgError ? (
          <img
            src={ROBOT_IMAGES[pose]}
            alt={`TexnoQadam Robot - ${pose}`}
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
        ) : (
          /* High-precision SVG fallback of the exact White & Orange TexnoQadam Robot */
          <svg viewBox="0 0 120 120" className="w-full h-full p-2" fill="none">
            <rect width="120" height="120" rx="20" fill="#FFF7ED" />
            {/* Ear pods */}
            <ellipse cx="22" cy="50" rx="6" ry="12" fill="#FF6B00" />
            <ellipse cx="98" cy="50" rx="6" ry="12" fill="#FF6B00" />
            {/* Robot Head */}
            <rect x="26" y="22" width="68" height="54" rx="26" fill="#FFFFFF" stroke="#E2E8F0" strokeWidth="3" />
            <path d="M46 22H74L70 29H50L46 22Z" fill="#FF6B00" />
            {/* Black Visor Screen */}
            <rect x="34" y="32" width="52" height="34" rx="14" fill="#0F172A" />
            {/* Glowing Orange Eyes & Smile */}
            <path d="M43 48C45 43 51 43 53 48" stroke="#FF8A00" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M67 48C69 43 75 43 77 48" stroke="#FF8A00" strokeWidth="3.5" strokeLinecap="round" />
            <path d="M54 56C57 60 63 60 66 56" stroke="#FF8A00" strokeWidth="3" strokeLinecap="round" />
            {/* Torso */}
            <rect x="38" y="78" width="44" height="32" rx="12" fill="#FFFFFF" stroke="#FF6B00" strokeWidth="3" />
            <text x="60" y="98" textAnchor="middle" fontSize="11" fontWeight="800" fill="#FF6B00">
              TQ
            </text>
          </svg>
        )}
      </div>
      {caption !== undefined ? (
        caption && (
          <span className="mt-1.5 text-xs font-semibold text-slate-600 text-center">
            {caption}
          </span>
        )
      ) : (
        <span className="mt-1 text-[11px] font-semibold text-orange-600">
          {poseLabels[pose]}
        </span>
      )}
    </div>
  );
};

export const AvatarBadge: React.FC<{
  avatarId: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}> = ({ avatarId, size = 'md' }) => {
  const [imgErr, setImgErr] = useState(false);
  const found = PREDEFINED_AVATARS.find((a) => a.id === avatarId) || PREDEFINED_AVATARS[0];

  const dims = {
    sm: 'w-8 h-8 text-base',
    md: 'w-11 h-11 text-xl',
    lg: 'w-16 h-16 text-3xl',
    xl: 'w-20 h-20 text-4xl',
  }[size];

  if (found.imageUrl && !imgErr) {
    return (
      <div className={`${dims} rounded-full overflow-hidden border-2 border-orange-400 bg-white shrink-0 shadow-sm`}>
        <img
          src={found.imageUrl}
          alt={found.name}
          referrerPolicy="no-referrer"
          onError={() => setImgErr(true)}
          className="w-full h-full object-cover"
        />
      </div>
    );
  }

  return (
    <div
      className={`${dims} rounded-full bg-gradient-to-br ${found.bgGradient} text-white flex items-center justify-center shrink-0 shadow-sm border-2 border-white`}
      title={found.name}
    >
      <span>{found.emoji}</span>
    </div>
  );
};
