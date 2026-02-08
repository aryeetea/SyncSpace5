import { useEffect, useState } from 'react';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'night';

export interface TimeTheme {
  type: TimeOfDay;
  background: string;
  gradient: string;
  accent: string;
}

const themes: Record<TimeOfDay, TimeTheme> = {
  morning: {
    type: 'morning',
    background: 'from-amber-200/20 via-rose-200/20 to-pink-200/20',
    gradient: 'from-yellow-300/10 to-pink-300/10',
    accent: '#ffd54f'
  },
  afternoon: {
    type: 'afternoon',
    background: 'from-sky-200/20 via-blue-200/20 to-cyan-200/20',
    gradient: 'from-blue-300/10 to-cyan-300/10',
    accent: '#64b5f6'
  },
  evening: {
    type: 'evening',
    background: 'from-orange-300/20 via-pink-300/20 to-purple-300/20',
    gradient: 'from-orange-300/10 to-purple-400/10',
    accent: '#ff6f91'
  },
  night: {
    type: 'night',
    background: 'from-indigo-400/20 via-purple-400/20 to-pink-400/20',
    gradient: 'from-indigo-500/10 to-purple-500/10',
    accent: '#ba68c8'
  }
};

function getTimeOfDay(): TimeOfDay {
  const hour = new Date().getHours();
  
  if (hour >= 5 && hour < 12) return 'morning';
  if (hour >= 12 && hour < 17) return 'afternoon';
  if (hour >= 17 && hour < 21) return 'evening';
  return 'night';
}

export function useTimeOfDay() {
  const [theme, setTheme] = useState<TimeTheme>(() => themes[getTimeOfDay()]);

  useEffect(() => {
    const updateTheme = () => {
      setTheme(themes[getTimeOfDay()]);
    };

    // Update theme every minute
    const interval = setInterval(updateTheme, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return theme;
}
