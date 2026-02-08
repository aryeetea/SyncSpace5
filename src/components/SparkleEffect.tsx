import { useEffect, useState } from 'react';

interface Sparkle {
  id: number;
  x: number;
  y: number;
}

interface SparkleEffectProps {
  x: number;
  y: number;
  onComplete?: () => void;
}

export function SparkleEffect({ x, y, onComplete }: SparkleEffectProps) {
  const [sparkles] = useState<Sparkle[]>([
    { id: 1, x: 0, y: -10 },
    { id: 2, x: 10, y: -5 },
    { id: 3, x: -10, y: -5 },
    { id: 4, x: 8, y: 5 },
    { id: 5, x: -8, y: 5 }
  ]);

  useEffect(() => {
    const timer = setTimeout(() => {
      onComplete?.();
    }, 600);
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div
      className="fixed pointer-events-none z-50"
      style={{ left: x, top: y, transform: 'translate(-50%, -50%)' }}
    >
      {sparkles.map((sparkle) => (
        <div
          key={sparkle.id}
          className="absolute animate-sparkle"
          style={{
            left: sparkle.x,
            top: sparkle.y,
            animationDelay: `${sparkle.id * 0.05}s`
          }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12">
            <path
              d="M6 0 L7 5 L12 6 L7 7 L6 12 L5 7 L0 6 L5 5 Z"
              fill="#ffd700"
              opacity="0.9"
            />
          </svg>
        </div>
      ))}
      {/* Center glow */}
      <div className="absolute inset-0 animate-ping">
        <div className="w-6 h-6 rounded-full bg-yellow-300/40 -translate-x-1/2 -translate-y-1/2" />
      </div>
    </div>
  );
}
