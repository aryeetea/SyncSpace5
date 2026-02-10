import { useState, useEffect, useRef } from 'react';
import { DayColumn } from './DayColumn';
import { MemberList } from './MemberList';
import { GlassCard } from './GlassCard';
import { BestTimesSummary } from './BestTimesSummary';
import { AvailabilityStatus, DAYS, TIME_SLOTS, Member } from '../types/schedule';
import { ArrowLeft, Copy, Check, RotateCcw, Calendar, Volume2, VolumeX } from 'lucide-react';
import { projectId, publicAnonKey } from '../utils/supabase/info';
const backgroundImage = new URL('../assets/background.png', import.meta.url).href;
import { sounds } from '../utils/sounds';
import { AnimeParticles } from './AnimeParticles';
import { FloatingClouds } from './FloatingClouds';
import { WindowFrame } from './WindowFrame';
import { DeskItems } from './DeskItems';
import { AnimeLoadingSpinner } from './AnimeLoadingSpinner';
import { useTimeOfDay } from '../hooks/useTimeOfDay';

const API_URL = `https://${projectId}.supabase.co/functions/v1/make-server-090a6328`;

interface GroupRoomProps {
  groupName: string;
  groupCode: string;
  userName: string;
  memberId: string;
  onBack: () => void;
}

export function GroupRoom({ groupName, groupCode, userName, memberId, onBack }: GroupRoomProps) {
  const [copied, setCopied] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [members, setMembers] = useState<Member[]>([]);
  const [lastWeekTemplate, setLastWeekTemplate] = useState<any[] | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isMuted, setIsMuted] = useState(() => sounds.getMuted());
  const timeOfDay = useTimeOfDay();

  // ✅ Available stays "available"
  const [activePaintMode, setActivePaintMode] = useState<AvailabilityStatus | null>('available');

  // --- Drag state (no API spam) ---
  const [isDragging, setIsDragging] = useState(false);
  const dragTouchedRef = useRef<Set<string>>(new Set());
  const pendingSaveRef = useRef(false);

  // Keep latest members accessible inside pointer-up handlers
  const membersRef = useRef<Member[]>([]);
  useEffect(() => {
    membersRef.current = members;
  }, [members]);

  // Initialize empty availability structure
  const createEmptyAvailability = () => {
    return DAYS.map(day => ({
      day,
      blocks: TIME_SLOTS.map(slot => ({
        hour: slot.hour,
        minute: slot.minute,
        status: null
      }))
    }));
  };

  // Fetch group data and members
  const fetchGroupData = async () => {
    try {
      const response = await fetch(`${API_URL}/groups/${groupCode}`, {
        headers: { Authorization: `Bearer ${publicAnonKey}` }
      });

      if (!response.ok) throw new Error('Failed to fetch group data');

      const data = await response.json();

      const transformedMembers: Member[] = data.members.map((m: any) => ({
        id: m.id,
        name: m.name,
        avatar: '',
        availability: m.availability || createEmptyAvailability()
      }));

      setMembers(transformedMembers);
    } catch (error) {
      console.error('Error fetching group data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Save availability to server (call ONCE after drag ends)
  const saveAvailability = async (availability: any) => {
    setIsSaving(true);
    try {
      const response = await fetch(`${API_URL}/groups/${groupCode}/availability`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ memberId, availability })
      });

      if (!response.ok) {
        throw new Error('Failed to save availability');
      }
    } catch (error) {
      console.error('Error saving availability:', error);
    } finally {
      setIsSaving(false);
    }
  };

  // Load data on mount
  useEffect(() => {
    fetchGroupData();

    const savedTemplate = localStorage.getItem(`lastWeek_${memberId}`);
    if (savedTemplate) setLastWeekTemplate(JSON.parse(savedTemplate));

    // Poll for updates (keeps everyone in sync without needing realtime subscriptions)
    // 10s is a good balance for groups (reduces network + re-renders vs 5s)
    const interval = setInterval(fetchGroupData, 10000);
    return () => clearInterval(interval);
  }, [groupCode]);

  // Save current availability as "last week" template when user makes changes
  useEffect(() => {
    if (!isLoading && members.length > 0) {
      const current = members.find(m => m.id === memberId);
      if (current && current.availability) {
        const hasAvailability = current.availability.some(day =>
          day.blocks.some(block => block.status !== null)
        );

        if (hasAvailability) {
          localStorage.setItem(`lastWeek_${memberId}`, JSON.stringify(current.availability));
          setLastWeekTemplate(current.availability);
        }
      }
    }
  }, [members, memberId, isLoading]);

  const currentMember =
    members.find(m => m.id === memberId) || {
      id: memberId,
      name: userName,
      avatar: '',
      availability: createEmptyAvailability()
    };

  // Availability score for subtle highlighting
  const getAvailabilityScore = (dayIndex: number, hour: number, minute: number): number => {
    if (members.length <= 1) return 0;

    const availableCount = members.filter(member => {
      const block = member.availability[dayIndex]?.blocks.find(b => b.hour === hour && b.minute === minute);
      return block?.status === 'available' || block?.status === 'remote';
    }).length;

    return availableCount / members.length;
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(groupCode);
    sounds.copy();
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ✅ Single click update (still saves immediately)
  const handleUpdateBlock = (dayIndex: number, hour: number, minute: number, status: AvailabilityStatus | null) => {
    if (status === 'available') sounds.availableChime();
    else if (status === 'remote') sounds.remoteChime();
    else if (status === 'busy') sounds.busyTone();
    else sounds.softClick();

    setMembers(prev => {
      const updated = [...prev];
      const userIndex = updated.findIndex(m => m.id === memberId);

      if (userIndex !== -1) {
        const userAvailability = updated[userIndex].availability[dayIndex];
        const blockIndex = userAvailability.blocks.findIndex(b => b.hour === hour && b.minute === minute);

        if (blockIndex !== -1) {
          userAvailability.blocks[blockIndex].status = status;
          saveAvailability(updated[userIndex].availability);
        }
      }

      return updated;
    });
  };

  // ✅ Local-only apply (used during drag so we don't spam server)
  const applyStatusToCellLocal = (dayIndex: number, hour: number, minute: number, status: AvailabilityStatus | null) => {
    setMembers(prev => {
      const updated = [...prev];
      const userIndex = updated.findIndex(m => m.id === memberId);
      if (userIndex === -1) return prev;

      const day = updated[userIndex].availability[dayIndex];
      const blockIndex = day.blocks.findIndex(b => b.hour === hour && b.minute === minute);
      if (blockIndex === -1) return prev;

      day.blocks[blockIndex].status = status;
      return updated;
    });
  };

  const cellKey = (dayIndex: number, hour: number, minute: number) => `${dayIndex}-${hour}-${minute}`;

  // ✅ Drag start: paint first cell
  const startDragPaint = (dayIndex: number, hour: number, minute: number) => {
    setIsDragging(true);
    dragTouchedRef.current.clear();
    pendingSaveRef.current = true;

    // (Optional: play one tiny sound ONCE on drag start)
    sounds.softClick();

    const key = cellKey(dayIndex, hour, minute);
    dragTouchedRef.current.add(key);

    applyStatusToCellLocal(dayIndex, hour, minute, activePaintMode);
  };

  // ✅ Drag over: paint new cells only
  const dragPaintOver = (dayIndex: number, hour: number, minute: number) => {
    if (!isDragging) return;

    const key = cellKey(dayIndex, hour, minute);
    if (dragTouchedRef.current.has(key)) return;

    dragTouchedRef.current.add(key);
    applyStatusToCellLocal(dayIndex, hour, minute, activePaintMode);
  };

  // ✅ Drag end: save ONCE
  const endDragAndSave = async () => {
    if (!isDragging) return;

    setIsDragging(false);

    if (!pendingSaveRef.current) return;
    pendingSaveRef.current = false;

    const latestMembers = membersRef.current;
    const current = latestMembers.find(m => m.id === memberId);

    if (current?.availability) {
      await saveAvailability(current.availability);
    }
  };

  // Global pointer up so it saves even if mouse leaves the grid
  useEffect(() => {
    const onUp = () => {
      endDragAndSave();
    };

    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);

    return () => {
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  const handleResetSchedule = () => {
    sounds.clear();
    const emptyAvailability = createEmptyAvailability();
    setMembers(prev => {
      const updated = [...prev];
      const userIndex = updated.findIndex(m => m.id === memberId);

      if (userIndex !== -1) {
        updated[userIndex].availability = emptyAvailability;
        saveAvailability(emptyAvailability);
      }

      return updated;
    });
  };

  const handleCopyFromLastWeek = () => {
    if (!lastWeekTemplate) return;

    sounds.copy();
    const copiedAvailability = JSON.parse(JSON.stringify(lastWeekTemplate));

    setMembers(prev => {
      const updated = [...prev];
      const userIndex = updated.findIndex(m => m.id === memberId);

      if (userIndex !== -1) {
        updated[userIndex].availability = copiedAvailability;
        saveAvailability(copiedAvailability);
      }

      return updated;
    });
  };

  const onLeave = () => {
    sounds.transition();
    onBack();
  };

  const toggleMute = () => {
    const newMuted = sounds.toggleMute();
    setIsMuted(newMuted);
    if (!newMuted) sounds.softClick();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen w-full relative overflow-hidden flex items-center justify-center">
        <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />
        <div className={`fixed inset-0 bg-linear-to-b ${timeOfDay.gradient} transition-all duration-1000`} />
        <div className="fixed inset-0 page-overlay" />
        <AnimeParticles count={15} />
        <FloatingClouds />
        <DeskItems />
        <WindowFrame />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <AnimeLoadingSpinner />
          <GlassCard>
            <p className="hangyaku-font text-slate-300">loading group...</p>
          </GlassCard>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full relative overflow-hidden">
      {/* Background image */}
      <div className="fixed inset-0 bg-cover bg-center" style={{ backgroundImage: `url(${backgroundImage})` }} />

      {/* Time-of-day gradient overlay */}
      <div className={`fixed inset-0 bg-linear-to-b ${timeOfDay.gradient} transition-all duration-1000`} />

      {/* Overlay */}
      <div className="fixed inset-0 page-overlay" />

      {/* Anime environment effects */}
      <AnimeParticles count={20} />
      <FloatingClouds />
      <DeskItems />
      <WindowFrame />

      {/* Content */}
      <div className="relative z-10 min-h-screen p-4 sm:p-6">
        <div className="max-w-[1600px] mx-auto space-y-4 sm:space-y-6">
          {/* Header */}
          <div className="flex flex-col gap-3 sm:gap-0 sm:flex-row sm:items-center sm:justify-between animate-slide-in-left">
            <div className="flex items-center gap-3 sm:gap-4">
              <button
                onClick={onLeave}
                className="hangyaku-font flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all duration-300"
              >
                <ArrowLeft className="w-4 h-4" />
                back home
              </button>

              <h1 className="hangyaku-font bubble-text-sm text-xl sm:text-2xl truncate">{groupName}</h1>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <GlassCard className="p-3! flex items-center gap-3 flex-1 sm:flex-initial">
                <span className="hangyaku-font text-sm text-slate-300/70">group code:</span>
                <code className="hangyaku-font text-sm text-slate-100 font-mono">{groupCode}</code>
                <button
                  onClick={handleCopyCode}
                  className="p-2 hover:bg-white/10 rounded-lg transition-all duration-300"
                  title="Copy code"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-slate-400" />}
                </button>
              </GlassCard>

              <button
                onClick={handleResetSchedule}
                className="hangyaku-font flex items-center gap-2 px-4 py-2.5 sm:py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-slate-300 transition-all duration-300"
                title="Clear all availability"
              >
                <RotateCcw className="w-4 h-4" />
                clear
              </button>
            </div>
          </div>

          {/* Legend */}
          <GlassCard className="p-4! animate-slide-up animate-delay-100">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-3 sm:gap-8 flex-1">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-emerald-400/70 animate-gentle-pulse" />
                  <span className="hangyaku-font text-sm text-emerald-300/90">available (in person)</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-blue-400/70 animate-gentle-pulse" style={{ animationDelay: '0.3s' }} />
                  <span className="hangyaku-font text-sm text-blue-300/90">available (remote)</span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400/70 animate-gentle-pulse" style={{ animationDelay: '0.6s' }} />
                  <span className="hangyaku-font text-sm text-rose-300/90">busy</span>
                </div>
              </div>

              {/* ✅ Paint mode buttons (now self-explanatory) */}
              <div className="flex items-center gap-3">
                <span className="hangyaku-font text-xs text-slate-400/80">paint:</span>
                <span
                  className={[
                    'hangyaku-font text-xs font-medium capitalize',
                    activePaintMode === 'available'
                      ? 'text-emerald-300/90'
                      : activePaintMode === 'remote'
                      ? 'text-blue-300/90'
                      : activePaintMode === 'busy'
                      ? 'text-rose-300/90'
                      : 'text-slate-300/80'
                  ].join(' ')}
                >
                  {activePaintMode === 'available'
                    ? 'in person'
                    : activePaintMode === 'remote'
                    ? 'remote'
                    : activePaintMode === 'busy'
                    ? 'busy'
                    : 'off'}
                </span>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setActivePaintMode('available')}
                    aria-pressed={activePaintMode === 'available'}
                    className={[
                      'h-9 w-9 rounded-full border transition-all duration-200 flex items-center justify-center',
                      'backdrop-blur-md',
                      activePaintMode === 'available'
                        ? 'border-emerald-400/70 bg-emerald-400/18 shadow-[0_0_18px_rgba(52,211,153,0.18)] ring-2 ring-emerald-400/20'
                        : 'border-emerald-400/35 bg-emerald-400/10 hover:bg-emerald-400/14 hover:border-emerald-400/55'
                    ].join(' ')}
                    title="Available (In Person)"
                  >
                    <span className="w-3 h-3 block rounded-full bg-emerald-400" />
                  </button>

                  <button
                    onClick={() => setActivePaintMode('remote')}
                    aria-pressed={activePaintMode === 'remote'}
                    className={[
                      'h-9 w-9 rounded-full border transition-all duration-200 flex items-center justify-center',
                      'backdrop-blur-md',
                      activePaintMode === 'remote'
                        ? 'border-blue-400/70 bg-blue-400/18 shadow-[0_0_18px_rgba(96,165,250,0.18)] ring-2 ring-blue-400/20'
                        : 'border-blue-400/35 bg-blue-400/10 hover:bg-blue-400/14 hover:border-blue-400/55'
                    ].join(' ')}
                    title="Available (Remote)"
                  >
                    <span className="w-3 h-3 block rounded-full bg-blue-400" />
                  </button>

                  <button
                    onClick={() => setActivePaintMode('busy')}
                    aria-pressed={activePaintMode === 'busy'}
                    className={[
                      'h-9 w-9 rounded-full border transition-all duration-200 flex items-center justify-center',
                      'backdrop-blur-md',
                      activePaintMode === 'busy'
                        ? 'border-rose-400/70 bg-rose-400/18 shadow-[0_0_18px_rgba(251,113,133,0.18)] ring-2 ring-rose-400/20'
                        : 'border-rose-400/35 bg-rose-400/10 hover:bg-rose-400/14 hover:border-rose-400/55'
                    ].join(' ')}
                    title="Busy"
                  >
                    <span className="w-3 h-3 block rounded-full bg-rose-400" />
                  </button>
                </div>
              </div>

              {lastWeekTemplate && (
                <button
                  onClick={handleCopyFromLastWeek}
                  className="hangyaku-font flex items-center justify-center sm:justify-start gap-2 px-3 py-2 sm:py-1.5 text-xs text-slate-400/70 hover:text-slate-300 hover:bg-white/5 rounded-lg transition-all"
                  title="Copy availability from last week"
                >
                  <Calendar className="w-3.5 h-3.5" />
                  copy from last week
                </button>
              )}
            </div>
          </GlassCard>

          {/* Main Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
            {/* Calendar */}
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-3 min-w-max">
                {DAYS.map((day, index) => (
                  <DayColumn
                    key={day}
                    day={day}
                    schedule={currentMember.availability[index]}
                    onUpdateBlock={(hour: number, minute: number, status: AvailabilityStatus | null) =>
                      handleUpdateBlock(index, hour, minute, status)
                    }
                    activePaintMode={activePaintMode}
                    getAvailabilityScore={(hour: number, minute: number) => getAvailabilityScore(index, hour, minute)}
                    onCellPointerDown={(hour: number, minute: number) => startDragPaint(index, hour, minute)}
                    onCellPointerEnter={(hour: number, minute: number) => dragPaintOver(index, hour, minute)}
                    isDragging={isDragging}
                  />
                ))}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:sticky lg:top-6 h-fit">
              <div className="space-y-4">
                <BestTimesSummary members={members} />
                <MemberList members={members} currentUserId={memberId} />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sound Toggle */}
      <button
        onClick={toggleMute}
        className="fixed top-6 right-6 z-50 p-3 bg-white/5 hover:bg-white/10 border border-slate-300/20 rounded-xl text-slate-300 transition-all duration-300"
        title={isMuted ? 'Unmute sounds' : 'Mute sounds'}
      >
        {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
      </button>
    </div>
  );
}
