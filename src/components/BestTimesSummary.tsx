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
  // Calculate availability for all time slots
  const calculateAllTimeSlots = (): TimeSlot[] => {
    const slots: TimeSlot[] = [];
    
    DAYS.forEach((day, dayIndex) => {
      TIME_SLOTS.forEach(slot => {
        let availableCount = 0;
        
        members.forEach(member => {
          const block = member.availability[dayIndex].blocks.find(b => b.hour === slot.hour && b.minute === slot.minute);
          if (block?.status === 'available' || block?.status === 'remote') {
            availableCount++;
          }
        });
        
        const percentage = members.length > 0 ? (availableCount / members.length) * 100 : 0;
        
        slots.push({
          day,
          hour: slot.hour,
          minute: slot.minute,
          availableCount,
          totalMembers: members.length,
          percentage
        });
      });
    });
    
    return slots;
  };

  const allSlots = calculateAllTimeSlots();
  
  // Find best times (80%+ availability)
  const bestSlots = allSlots
    .filter(slot => slot.percentage >= 80)
    .sort((a, b) => b.percentage - a.percentage)
    .slice(0, 5);

  // Find best day (day with most high-availability slots)
  const dayScores = DAYS.map(day => {
    const daySlots = allSlots.filter(slot => slot.day === day);
    const highAvailabilitySlots = daySlots.filter(slot => slot.percentage >= 80);
    const avgPercentage = daySlots.reduce((sum, slot) => sum + slot.percentage, 0) / daySlots.length;
    
    return {
      day,
      highAvailabilityCount: highAvailabilitySlots.length,
      avgPercentage
    };
  });

  const bestDay = dayScores.sort((a, b) => {
    if (b.highAvailabilityCount !== a.highAvailabilityCount) {
      return b.highAvailabilityCount - a.highAvailabilityCount;
    }
    return b.avgPercentage - a.avgPercentage;
  })[0];

  const formatTime = (hour: number, minute: number) => {
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    return `${displayHour}:${minute.toString().padStart(2, '0')} ${period}`;
  };

  if (members.length === 0) {
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
        {/* Header */}
        <div>
          <h3 className="hangyaku-font text-slate-200/90 text-lg mb-1">best times to meet</h3>
          <p className="hangyaku-font text-slate-400/60 text-sm">times when most members are available</p>
        </div>

        {/* Best Day */}
        {bestDay && bestDay.highAvailabilityCount > 0 && (
          <div className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/15">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-emerald-400/60 mt-0.5 flex-shrink-0" />
              <div>
                <div className="hangyaku-font text-emerald-300/70 font-medium mb-1">
                  {bestDay.day} looks promising
                </div>
                <div className="hangyaku-font text-emerald-400/50 text-sm">
                  {bestDay.highAvailabilityCount} time slot{bestDay.highAvailabilityCount !== 1 ? 's' : ''} with good availability
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Best Time Slots */}
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
            <p className="hangyaku-font text-slate-500/60 text-xs">
              mark your availability to find common times
            </p>
          </div>
        )}
      </div>
    </GlassCard>
  );
}