import { AvailabilityStatus } from '../types/schedule';

interface TimeBlockProps {
  hour: number;
  minute: number;
  status: AvailabilityStatus | null;

  // Kept for compatibility (your DayColumn still passes these),
  // but drag/click behavior is now handled by the DayColumn wrapper + GroupRoom.
  onStatusChange: (status: AvailabilityStatus | null) => void;
  onDragOver: (status: AvailabilityStatus | null) => void;

  isHighlighted?: boolean;
  availabilityScore?: number;
  paintMode?: AvailabilityStatus | null;
}

export function TimeBlock({
  hour,
  minute,
  status,
  isHighlighted,
  availabilityScore = 0,
}: TimeBlockProps) {
  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const displayMinute = minute.toString().padStart(2, '0');
    return `${displayHour}:${displayMinute} ${period}`;
  };

  // Subtle highlighting based on availability score
  const getSmartHighlighting = () => {
    if (availabilityScore === 0) return '';
    if (availabilityScore >= 0.7) return 'smart-highlight-high';
    if (availabilityScore >= 0.4) return 'smart-highlight-medium';
    if (availabilityScore > 0) return 'smart-highlight-low';
    return '';
  };

  const getStatusStyles = () => {
    const smartHighlight = getSmartHighlighting();

    if (!status) {
      return `bg-white/5 border-white/10 hover:bg-white/10 ${smartHighlight}`;
    }

    switch (status) {
      case 'available':
        return `bg-emerald-400/15 border-emerald-400/25 hover:bg-emerald-400/20 ${smartHighlight}`;
      case 'remote':
        return `bg-blue-400/15 border-blue-400/25 hover:bg-blue-400/20 ${smartHighlight}`;
      case 'busy':
        return `bg-rose-400/15 border-rose-400/25 hover:bg-rose-400/20 ${smartHighlight}`;
      default:
        return `bg-white/5 border-white/10 hover:bg-white/10 ${smartHighlight}`;
    }
  };

  const getStatusDot = () => {
    if (!status) return null;

    switch (status) {
      case 'available':
        return (
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-emerald-400/70 animate-gentle-pulse" />
        );
      case 'remote':
        return (
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-blue-400/70 animate-gentle-pulse" />
        );
      case 'busy':
        return (
          <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-rose-400/70 animate-gentle-pulse" />
        );
      default:
        return null;
    }
  };

  return (
    <div
      className={[
        'time-block hangyaku-font relative h-8 sm:h-9 rounded-lg border transition-all duration-300',
        'cursor-pointer select-none',
        getStatusStyles(),
        isHighlighted ? 'ring-2 ring-yellow-400/50' : '',
      ].join(' ')}
    >
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[9px] sm:text-[10px] text-slate-300/60">
          {formatTime(hour, minute)}
        </span>
      </div>

      {getStatusDot()}
    </div>
  );
}
