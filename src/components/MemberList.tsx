import { GlassCard } from './GlassCard';
import { Users, User } from 'lucide-react';
import { Member } from '../types/schedule';
import { AnimeAvatar } from './AnimeAvatar';

interface MemberListProps {
  members: Member[];
  currentUserId?: string;
}

export function MemberList({ members, currentUserId }: MemberListProps) {
  return (
    <GlassCard>
      <div className="animate-slide-up animate-delay-400">
        {/* Header */}
        <div className="flex items-center gap-2 pb-2 border-b border-white/10">
          <Users className="w-5 h-5 text-slate-400/70" />
          <h3 className="hangyaku-font text-slate-200/90 text-lg">members</h3>
          <span className="hangyaku-font text-slate-400/60 text-sm ml-auto">{members.length}</span>
        </div>
        
        {/* Member cards */}
        <div className="space-y-2">
          {members.map((member, index) => (
            <div
              key={member.id}
              className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-300 ${
                member.id === currentUserId 
                  ? 'bg-white/10 border border-pink-300/20' 
                  : 'bg-white/5 border border-white/10 hover:bg-white/8'
              }`}
            >
              {/* Anime avatar */}
              <AnimeAvatar name={member.name} size="md" className="shrink-0" />
              
              {/* Name label */}
              <div className="flex-1 min-w-0">
                <p className="hangyaku-font text-slate-200/90 text-sm truncate">
                  {member.name}
                  {member.id === currentUserId && (
                    <span className="text-pink-300/60 ml-2">(you)</span>
                  )}
                </p>
              </div>
            </div>
          ))}
          
          {members.length === 0 && (
            <div className="text-center py-8">
              <div className="w-12 h-12 rounded-full bg-linear-to-br from-slate-400/20 to-slate-500/20 flex items-center justify-center mx-auto mb-3">
                <Users className="w-6 h-6 text-slate-400/40" />
              </div>
              <p className="hangyaku-font text-slate-400/60 text-sm">no members yet</p>
              <p className="hangyaku-font text-slate-500/50 text-xs mt-1">share the group code to invite people</p>
            </div>
          )}
        </div>
      </div>
    </GlassCard>
  );
}