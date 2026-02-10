import { useMemo } from 'react';
import { GlassCard } from './GlassCard';
import { Calendar, Clock, Users } from 'lucide-react';
import { Member, DAYS, TIME_SLOTS } from '../types/schedule';

interface BestTimesSummaryProps {
  members: Member[];
}

interface TimeSlot {
  day: string;
  hour: number;
  minute: number;
  availableCount: number;
  totalMembers: number;
  percentage: number;
}

export function BestTimesSummary({ members }: BestTimesSummaryProps) {
  const total = members.length;

  const allSlots = useMemo<TimeSlot[]>(() => {
    const slots: TimeSlot[] = [];

    if (total === 0) return slots;

    DAYS.forEach((day, dayIndex) => {
      TIME_SLOTS.forEach(slot => {
        let availableCount = 0;

        for (const member of members) {
          const block = member.availability[dayIndex]?.blocks.find(
            b => b.hour === slot.hour && b.minute === slot.minute
          );
          if (block?.status === 'available' || block?.status === 'remote') {
            availableCount++;
          }
        }

        const percentage = (availableCount / total) * 100;

        slots.push({
          day,
          hour: slot.hour,
          minute: slot.minute,
          availableCount,
          totalMembers: total,
          percentage
        });
      });
    });

    return slots;
  }, [members, total]);

  // ✅ Scaling tiers for 10+ people:
  // Perfect: N/N
  // Great: N-1/N (for N>=2)
  // Good:  N-2/N (only when N>=6)
  const minPerfect = total;
  const minGreat = total >= 2 ? total - 1 : total;
  const minGood = total >= 6 ? total - 2 : minGreat;

  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  const sortByBest = (a: TimeSlot, b: TimeSlot) => {
    if (b.availableCount !== a.availableCount) return b.availableCount - a.availableCount;
    return b.percentage - a.percentage;
  };

  const perfect = allSlots.filter(s => s.availableCount === minPerfect).sort(sortByBest);
  const great = allSlots
    .filter(s => s.availableCount === minGreat && s.availableCount < minPerfect)
    .sort(sortByBest);
  const good = allSlots
    .filter(s => s.availableCount === minGood && s.availableCount < minGreat)
    .sort(sortByBest);

  // pick top 5, preferring perfect then great then good
  const bestSlots = [...perfect, ...great, ...good].slice(0, 5);

  // Best day = day with most "great or better" slots
  const bestDay = useMemo(() => {
    if (total === 0) return null;

    const scores = DAYS.map(day => {
      const daySlots = allSlots.filter(s => s.day === day);
      const strong = daySlots.filter(s => s.availableCount >= minGreat).length;
      const avg = daySlots.reduce((sum, s) => sum + s.percentage, 0) / (daySlots.length || 1);
      return { day, strong, avg };
    });

    return scores.sort((a, b) => (b.strong !== a.strong ? b.strong - a.strong : b.avg - a.avg))[0];
  }, [allSlots, minGreat, total]);

  if (total === 0) {
    return (
      <GlassCard>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-slate-400/40 mx-auto mb-3" />
          <p className="text-slate-400/60 text-sm">waiting for members to join...</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <GlassCard>
      <div className="space-y-6 animate-slide-up animate-delay-300">
        <div>
          <h3 className="hangyaku-font text-slate-200/90 text-lg mb-1">best times to meet</h3>
          <p className="hangyaku-font text-slate-400/60 text-sm">
            perfect = {minPerfect}/{total}, great = {minGreat}/{total}
            {total >= 6 ? `, good = ${minGood}/${total}` : ''}
          </p>
        </div>

        {bestDay && bestDay.strong > 0 && (
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-emerald-400/60 mt-0.5 shrink-0" />
              <div>
                <div className="hangyaku-font text-emerald-300/70 font-medium mb-1">
                  {bestDay.day} looks promising
                </div>
                <div className="hangyaku-font text-emerald-400/50 text-sm">
                  {bestDay.strong} time slot{bestDay.strong !== 1 ? 's' : ''} with strong availability
                </div>
              </div>
            </div>
          </div>
        )}

        {bestSlots.length > 0 ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-slate-400/70">
              <Clock className="w-4 h-4" />
              <span className="hangyaku-font">top meeting times</span>
            </div>

            {bestSlots.map((slot, index) => (
              <div
                key={`${slot.day}-${slot.hour}-${slot.minute}`}
                className="flex items-center justify-between p-3 rounded-lg bg-slate-200/5 border border-slate-300/10 hover:bg-slate-200/10 transition-all duration-300"
              >
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400/90 text-xs font-medium">
                    {index + 1}
                  </div>
                  <div>
                    <div className="hangyaku-font text-slate-200/90 text-sm font-medium">
                      {slot.day}, {formatTime(slot.hour, slot.minute)}
                    </div>
                    <div className="hangyaku-font text-slate-400/60 text-xs mt-0.5">
                      {slot.availableCount} of {slot.totalMembers} available
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <div className="hangyaku-font text-emerald-400/90 text-sm font-medium">
                    {Math.round(slot.percentage)}%
                  </div>
                  <div className="w-16 h-2 rounded-full bg-slate-400/20 overflow-hidden">
                    <div
                      className="h-full bg-emerald-400/60 rounded-full transition-all"
                      style={{ width: `${slot.percentage}%` }}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-6">
            <Users className="w-10 h-10 text-slate-400/40 mx-auto mb-3" />
            <p className="hangyaku-font text-slate-400/60 text-sm mb-1">no strong matches yet</p>
            <p className="hangyaku-font text-slate-500/60 text-xs">mark your availability to find common times</p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}
