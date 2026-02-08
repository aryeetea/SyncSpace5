import { TimeBlock } from './TimeBlock';
import { GlassCard } from './GlassCard';
import { DaySchedule, AvailabilityStatus, TIME_SLOTS } from '../types/schedule';

interface DayColumnProps {
  day: string;
  schedule: DaySchedule;

  // Single-cell update (click)
  onUpdateBlock: (hour: number, minute: number, status: AvailabilityStatus | null) => void;

  // Paint mode from GroupRoom
  activePaintMode?: AvailabilityStatus | null;

  // Optional highlighting (best times)
  highlightedSlots?: Array<{ hour: number; minute: number }>;

  // Score function (existing)
  getAvailabilityScore: (dayIndex: number, hour: number, minute: number) => number;

  // ✅ NEW: pointer-drag paint hooks from GroupRoom
  onCellPointerDown?: (hour: number, minute: number) => void;
  onCellPointerEnter?: (hour: number, minute: number) => void;
  isDragging?: boolean;
}

export function DayColumn({
  day,
  schedule,
  onUpdateBlock,
  highlightedSlots = [],
  getAvailabilityScore,
  activePaintMode,
  onCellPointerDown,
  onCellPointerEnter,
  isDragging = false,
}: DayColumnProps) {
  // Fallback for older drag approach (if TimeBlock still calls onDragOver)
  const handleDragOverFallback = (hour: number, minute: number, status: AvailabilityStatus | null) => {
    const applied = activePaintMode !== undefined ? activePaintMode : status;
    onUpdateBlock(hour, minute, applied ?? null);
  };

  // Day index for score calculation
  const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  const dayIndex = DAYS.findIndex(d => d === day.toLowerCase());

  return (
    <div
      className="flex flex-col min-w-[130px] sm:min-w-[140px] animate-slide-up"
      style={{ animationDelay: `${dayIndex * 0.05}s` }}
    >
      <GlassCard className="p-3.5! sm:p-4! relative overflow-hidden glass-shimmer">
        {/* Day header */}
        <div className="mb-3.5 sm:mb-4 text-center">
          <h3 className="hangyaku-font bubble-text-sm text-base sm:text-lg">{day}</h3>
        </div>

        {/* Time blocks */}
        <div className="space-y-1">
          {TIME_SLOTS.map(slot => {
            const block = schedule.blocks.find(b => b.hour === slot.hour && b.minute === slot.minute);

            const availabilityScore = getAvailabilityScore(dayIndex, slot.hour, slot.minute);
            const isHighlighted = highlightedSlots.some(s => s.hour === slot.hour && s.minute === slot.minute);

            return (
              // ✅ Wrapper receives pointer events for drag painting
              <div
                key={`${slot.hour}-${slot.minute}`}
                style={{ touchAction: 'none' }} // important for mobile drag
                onPointerDown={() => {
                  // If GroupRoom provided drag handler, use it
                  if (onCellPointerDown) onCellPointerDown(slot.hour, slot.minute);
                }}
                onPointerEnter={() => {
                  // While dragging, entering a new cell paints it
                  if (isDragging && onCellPointerEnter) onCellPointerEnter(slot.hour, slot.minute);
                }}
              >
                <TimeBlock
                  hour={slot.hour}
                  minute={slot.minute}
                  status={block?.status || null}
                  onStatusChange={(status) => onUpdateBlock(slot.hour, slot.minute, status)}
                  onDragOver={(status) => handleDragOverFallback(slot.hour, slot.minute, status)}
                  isHighlighted={isHighlighted}
                  availabilityScore={availabilityScore}
                  paintMode={activePaintMode}
                />
              </div>
            );
          })}
        </div>
      </GlassCard>
    </div>
  );
}
