import { useMemo } from 'react';

interface AnimeAvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Anime-style color palettes
const colorPalettes = [
  { bg: '#FFE5EC', hair: '#FFB3D9', eyes: '#FF6B9D', accent: '#FFA8CC' }, // Pink
  { bg: '#E5E5FF', hair: '#B8B3FF', eyes: '#8B7FFF', accent: '#A89FFF' }, // Purple
  { bg: '#E5F5FF', hair: '#A8D8FF', eyes: '#5EB3FF', accent: '#7FC8FF' }, // Blue
  { bg: '#FFF5E5', hair: '#FFD9A8', eyes: '#FFB366', accent: '#FFC88A' }, // Orange
  { bg: '#F0FFE5', hair: '#C8FFB3', eyes: '#8FD97F', accent: '#ADFF9E' }, // Green
  { bg: '#FFE5F5', hair: '#FFB3E6', eyes: '#E67ACC', accent: '#FF9FDB' }, // Magenta
  { bg: '#E5FFF5', hair: '#B3FFE0', eyes: '#66D9B3', accent: '#8FFFD4' }, // Mint
  { bg: '#FFF0E5', hair: '#FFDAB3', eyes: '#FFB380', accent: '#FFCC99' }, // Peach
];

// Face expressions
const expressions = [
  { eyes: '^_^', mouth: 'smile' },
  { eyes: '◕‿◕', mouth: 'smile' },
  { eyes: '●‿●', mouth: 'smile' },
  { eyes: '＾ω＾', mouth: 'happy' },
  { eyes: '✿◡✿', mouth: 'gentle' },
];

// Hair styles
const hairStyles = [
  'short',
  'long',
  'ponytail',
  'twintails',
  'bob',
];

export function AnimeAvatar({ name, size = 'md', className = '' }: AnimeAvatarProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
  };

  const iconSizes = {
    sm: { face: 24, element: 3 },
    md: { face: 36, element: 4 },
    lg: { face: 48, element: 5 },
  };

  // Generate consistent avatar based on name
  const avatar = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    
    const colorIndex = Math.abs(hash % colorPalettes.length);
    const expressionIndex = Math.abs(hash % expressions.length);
    const hairIndex = Math.abs((hash >> 8) % hairStyles.length);
    
    return {
      colors: colorPalettes[colorIndex],
      expression: expressions[expressionIndex],
      hairStyle: hairStyles[hairIndex],
      seed: Math.abs(hash),
    };
  }, [name]);

  const { face, element } = iconSizes[size];

  return (
    <div className={`${sizeClasses[size]} ${className} relative`}>
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        className="filter drop-shadow-lg"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="48"
          fill={avatar.colors.bg}
          stroke={avatar.colors.accent}
          strokeWidth="2"
        />

        {/* Hair base */}
        {avatar.hairStyle === 'short' && (
          <>
            <ellipse cx="50" cy="35" rx="38" ry="30" fill={avatar.colors.hair} />
            <ellipse cx="50" cy="30" rx="35" ry="25" fill={avatar.colors.hair} />
          </>
        )}

        {avatar.hairStyle === 'long' && (
          <>
            <ellipse cx="50" cy="35" rx="38" ry="30" fill={avatar.colors.hair} />
            <ellipse cx="30" cy="60" rx="12" ry="25" fill={avatar.colors.hair} />
            <ellipse cx="70" cy="60" rx="12" ry="25" fill={avatar.colors.hair} />
          </>
        )}

        {avatar.hairStyle === 'ponytail' && (
          <>
            <ellipse cx="50" cy="35" rx="38" ry="30" fill={avatar.colors.hair} />
            <ellipse cx="50" cy="20" rx="8" ry="15" fill={avatar.colors.hair} />
          </>
        )}

        {avatar.hairStyle === 'twintails' && (
          <>
            <ellipse cx="50" cy="35" rx="38" ry="30" fill={avatar.colors.hair} />
            <ellipse cx="25" cy="30" rx="8" ry="18" fill={avatar.colors.hair} transform="rotate(-20 25 30)" />
            <ellipse cx="75" cy="30" rx="8" ry="18" fill={avatar.colors.hair} transform="rotate(20 75 30)" />
          </>
        )}

        {avatar.hairStyle === 'bob' && (
          <>
            <ellipse cx="50" cy="35" rx="38" ry="30" fill={avatar.colors.hair} />
            <rect x="15" y="45" width="70" height="15" fill={avatar.colors.hair} rx="5" />
          </>
        )}

        {/* Face base */}
        <circle cx="50" cy="55" r="28" fill="#FFE4D6" />

        {/* Blush */}
        <ellipse cx="35" cy="60" rx="5" ry="3" fill="#FFB3C1" opacity="0.6" />
        <ellipse cx="65" cy="60" rx="5" ry="3" fill="#FFB3C1" opacity="0.6" />

        {/* Eyes */}
        {avatar.expression.eyes === '^_^' && (
          <>
            <path d="M 35 48 Q 40 52 45 48" stroke={avatar.colors.eyes} strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <path d="M 55 48 Q 60 52 65 48" stroke={avatar.colors.eyes} strokeWidth="2.5" fill="none" strokeLinecap="round" />
          </>
        )}

        {avatar.expression.eyes === '◕‿◕' && (
          <>
            <circle cx="38" cy="50" r="4" fill={avatar.colors.eyes} />
            <circle cx="38" cy="49" r="1.5" fill="white" />
            <circle cx="62" cy="50" r="4" fill={avatar.colors.eyes} />
            <circle cx="62" cy="49" r="1.5" fill="white" />
          </>
        )}

        {avatar.expression.eyes === '●‿●' && (
          <>
            <circle cx="38" cy="50" r="5" fill={avatar.colors.eyes} />
            <circle cx="38" cy="48" r="2" fill="white" />
            <circle cx="62" cy="50" r="5" fill={avatar.colors.eyes} />
            <circle cx="62" cy="48" r="2" fill="white" />
          </>
        )}

        {avatar.expression.eyes === '＾ω＾' && (
          <>
            <path d="M 33 48 Q 38 52 43 48" stroke={avatar.colors.eyes} strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M 57 48 Q 62 52 67 48" stroke={avatar.colors.eyes} strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        )}

        {avatar.expression.eyes === '✿◡✿' && (
          <>
            <circle cx="38" cy="50" r="3" fill={avatar.colors.eyes} />
            <circle cx="36" cy="49" r="1" fill="white" />
            <circle cx="62" cy="50" r="3" fill={avatar.colors.eyes} />
            <circle cx="60" cy="49" r="1" fill="white" />
          </>
        )}

        {/* Mouth */}
        {avatar.expression.mouth === 'smile' && (
          <path d="M 42 63 Q 50 68 58 63" stroke="#FF9FB3" strokeWidth="2" fill="none" strokeLinecap="round" />
        )}

        {avatar.expression.mouth === 'happy' && (
          <>
            <path d="M 42 63 Q 50 70 58 63" stroke="#FF9FB3" strokeWidth="2.5" fill="none" strokeLinecap="round" />
            <ellipse cx="50" cy="66" rx="4" ry="2" fill="#FF9FB3" opacity="0.3" />
          </>
        )}

        {avatar.expression.mouth === 'gentle' && (
          <ellipse cx="50" cy="64" rx="3" ry="2" fill="#FF9FB3" />
        )}

        {/* Hair shine */}
        <ellipse cx="45" cy="28" rx="8" ry="4" fill="white" opacity="0.4" />

        {/* Decorative element based on seed */}
        {avatar.seed % 3 === 0 && (
          <circle cx="75" cy="25" r="5" fill={avatar.colors.accent} opacity="0.8" />
        )}
        {avatar.seed % 3 === 1 && (
          <path d="M 75 20 L 77 25 L 82 25 L 78 28 L 80 33 L 75 30 L 70 33 L 72 28 L 68 25 L 73 25 Z" fill={avatar.colors.accent} opacity="0.8" />
        )}
        {avatar.seed % 3 === 2 && (
          <path d="M 75 25 L 78 28 L 72 28 Z" fill={avatar.colors.accent} opacity="0.8" />
        )}
      </svg>

      {/* Sparkle effect on hover */}
      <div className="absolute inset-0 opacity-0 hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        <svg width="100%" height="100%" viewBox="0 0 100 100">
          <path d="M 20 20 L 21 22 L 23 22 L 21 23 L 22 25 L 20 24 L 18 25 L 19 23 L 17 22 L 19 22 Z" fill="#FFD700" opacity="0.8" className="animate-pulse" />
          <path d="M 80 80 L 81 82 L 83 82 L 81 83 L 82 85 L 80 84 L 78 85 L 79 83 L 77 82 L 79 82 Z" fill="#FFD700" opacity="0.8" className="animate-pulse" style={{ animationDelay: '0.5s' }} />
        </svg>
      </div>
    </div>
  );
}
