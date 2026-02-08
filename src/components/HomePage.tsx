import { GlassCard } from './GlassCard';
import { Users, Copy, Check, Plus, LogIn, Volume2, VolumeX } from 'lucide-react';
import { useState } from 'react';
const backgroundImage = new URL('../assets/background.png', import.meta.url).href;
import { sounds } from '../utils/sounds';
import { AnimeParticles } from './AnimeParticles';
import { FloatingClouds } from './FloatingClouds';
import { WindowFrame } from './WindowFrame';
import { DeskItems } from './DeskItems';
import { JapaneseLabel } from './JapaneseLabel';
import { AnimeLoadingSpinner } from './AnimeLoadingSpinner';
import { useTimeOfDay } from '../hooks/useTimeOfDay';

interface HomePageProps {
  onCreateGroup: (userName: string) => void;
  onJoinGroup: (userName: string, groupCode: string) => void;
  isLoading?: boolean;
  error?: string | null;
}

export function HomePage({ onCreateGroup, onJoinGroup, isLoading, error }: HomePageProps) {
  const [name, setName] = useState('');
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [groupCode, setGroupCode] = useState('');
  const [isMuted, setIsMuted] = useState(() => sounds.getMuted());
  const theme = useTimeOfDay();

  const handleCreateGroup = () => {
    if (name.trim()) {
      sounds.success();
      sounds.transition();
      onCreateGroup(name.trim());
    }
  };

  const handleJoinGroup = () => {
    if (name.trim() && groupCode.trim()) {
      sounds.success();
      sounds.transition();
      onJoinGroup(name.trim(), groupCode.trim());
      setShowJoinModal(false);
    }
  };

  const toggleMute = () => {
    const newMuted = sounds.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) {
      sounds.softClick(); // Play a soft sound to confirm unmuting
    }
  };

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background image */}
      <div 
        className="fixed inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      />
      
      {/* Time-of-day gradient overlay */}
      <div className={`fixed inset-0 bg-linear-to-b ${theme.gradient} transition-all duration-1000`} />
      
      {/* Light overlay to enhance readability while showing the image */}
      <div className="fixed inset-0 page-overlay" />
      
      {/* Anime environment effects */}
      <AnimeParticles count={15} />
      <FloatingClouds />
      <DeskItems />
      <WindowFrame />
      
      {/* Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
        {/* Layered square cards */}
        <div className="relative animate-fade-in">
          {/* Background larger square for layered effect */}
          <div className="absolute inset-0 translate-x-3 translate-y-3 sm:translate-x-4 sm:translate-y-4 w-[340px] h-[500px] sm:w-[480px] sm:h-[480px] rounded-[2.5rem] sm:rounded-[3rem] bg-linear-to-br from-pink-300/25 via-purple-300/25 to-orange-300/25 backdrop-blur-sm border border-white/10 animate-gentle-float" />
          
          {/* Main square card */}
          <div className="relative w-[340px] h-[500px] sm:w-[480px] sm:h-[480px]">
            <GlassCard className="h-full flex flex-col items-center justify-center relative overflow-hidden glass-shimmer animate-breathing-glow">
              {/* Title with bubble text effect */}
              <h1 className="hangyaku-font bubble-text-pink text-4xl sm:text-5xl mb-12 sm:mb-16 tracking-wide animate-slide-up">
                Sync Space
              </h1>
              
              {/* Name input */}
              <div className="w-full max-w-xs mb-8 px-6 animate-slide-up animate-delay-200">
                <input
                  type="text"
                  placeholder="your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="hangyaku-font w-full px-6 py-4 bg-white/5 border border-pink-200/20 rounded-2xl text-slate-100 placeholder:text-slate-400/50 focus:outline-none focus:border-pink-300/40 focus:bg-white/10 transition-all text-center text-lg"
                />
              </div>
              
              {/* Buttons */}
              <div className="flex flex-col gap-4 w-full max-w-xs px-6">
                {/* Error message */}
                {error && (
                  <div className="hangyaku-font px-4 py-3 bg-red-400/10 border border-red-300/30 rounded-2xl text-red-200 text-center text-sm animate-fade-in">
                    {error}
                  </div>
                )}
                
                <button
                  onClick={handleCreateGroup}
                  disabled={!name.trim() || isLoading}
                  className="hangyaku-font anime-button anime-button-pink flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-lg animate-slide-up animate-delay-300"
                >
                  <Plus className="w-5 h-5" />
                  {isLoading ? 'creating...' : 'Create Group'}
                </button>
                
                <button
                  onClick={() => setShowJoinModal(true)}
                  disabled={!name.trim() || isLoading}
                  className="hangyaku-font anime-button anime-button-blue flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-lg animate-slide-up animate-delay-400"
                >
                  <LogIn className="w-5 h-5" />
                  Join Group
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>

      {/* Join Group Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 modal-overlay backdrop-blur-sm animate-fade-in">
          <div className="relative animate-slide-up w-full max-w-[400px]">
            <GlassCard className="w-full relative overflow-hidden glass-shimmer modal-glass">
              <h2 className="hangyaku-font text-xl sm:text-2xl text-slate-100 mb-6 text-center">join a group</h2>
              
              <input
                type="text"
                placeholder="enter group code"
                value={groupCode}
                onChange={(e) => setGroupCode(e.target.value)}
                className="hangyaku-font w-full px-4 sm:px-6 py-3 sm:py-4 mb-6 bg-white/5 border border-pink-200/20 rounded-2xl text-slate-100 placeholder:text-slate-400/50 focus:outline-none focus:border-pink-300/40 focus:bg-white/10 transition-all text-center text-base sm:text-lg"
              />
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowJoinModal(false)}
                  className="hangyaku-font flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-white/5 hover:bg-white/10 border border-slate-300/20 rounded-2xl text-slate-300 transition-all duration-300 text-sm sm:text-base"
                >
                  cancel
                </button>
                <button
                  onClick={handleJoinGroup}
                  disabled={!groupCode.trim()}
                  className="hangyaku-font flex-1 px-4 sm:px-6 py-2.5 sm:py-3 bg-linear-to-r from-blue-400/20 to-cyan-400/20 hover:from-blue-400/30 hover:to-cyan-400/30 border border-blue-300/30 rounded-2xl text-slate-100 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-300 text-sm sm:text-base"
                >
                  join
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      )}

      {/* Sound Toggle */}
      <button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 anime-icon-button p-3 rounded-xl text-slate-300"
        title={isMuted ? "Unmute sounds" : "Mute sounds"}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}