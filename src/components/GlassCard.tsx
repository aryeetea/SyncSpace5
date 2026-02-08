import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
}

export function GlassCard({ children, className = '', hover = false, style }: GlassCardProps) {
  const hoverClass = hover ? 'glass-card-hover cursor-pointer' : '';

  return (
    <div style={style} className={`glass-card rounded-3xl p-8 ${hoverClass} ${className}`}>
      {children}
    </div>
  );
}