import { useEffect, useState } from 'react';

interface Cloud {
  id: number;
  left: number;
  top: number;
  scale: number;
  speed: number;
  opacity: number;
}

export function FloatingClouds() {
  const [clouds, setClouds] = useState<Cloud[]>([]);

  useEffect(() => {
    // Initialize clouds
    const initialClouds: Cloud[] = Array.from({ length: 5 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 60 + 10,
      scale: Math.random() * 0.5 + 0.5,
      speed: Math.random() * 20 + 15,
      opacity: Math.random() * 0.15 + 0.05
    }));
    setClouds(initialClouds);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {clouds.map((cloud) => (
        <div
          key={cloud.id}
          className="absolute animate-float-cloud"
          style={{
            left: `${cloud.left}%`,
            top: `${cloud.top}%`,
            transform: `scale(${cloud.scale})`,
            opacity: cloud.opacity,
            animationDuration: `${cloud.speed}s`,
            animationDelay: `${cloud.id * -3}s`
          }}
        >
          <svg
            width="120"
            height="60"
            viewBox="0 0 120 60"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <ellipse cx="30" cy="40" rx="20" ry="15" fill="white" />
            <ellipse cx="50" cy="30" rx="25" ry="20" fill="white" />
            <ellipse cx="70" cy="35" rx="20" ry="18" fill="white" />
            <ellipse cx="90" cy="40" rx="18" ry="15" fill="white" />
          </svg>
        </div>
      ))}
    </div>
  );
}
