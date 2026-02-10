export type AvailabilityStatus = 'available' | 'busy' | 'unavailable' | 'remote';

export interface TimeBlock {
  hour: number;
  minute: number; // 0 or 30
  status: AvailabilityStatus | null;
}

export interface DaySchedule {
  day: string;
  blocks: TimeBlock[];
}

export interface DayAvailability {
  day: string;
  blocks: TimeBlock[];
}

export interface Member {
  id: string;
  name: string;
  avatar: string;
  availability: DayAvailability[];
}

export interface Group {
  id: string;
  name: string;
  code: string;
  members: Member[];
}

// Time slots from 8 AM to 11 PM in 30-minute intervals
// 8:00 ... 23:30 (32 slots)
export const TIME_SLOTS = Array.from({ length: 32 }, (_, i) => ({
  hour: Math.floor(i / 2) + 8,
  minute: (i % 2) * 30
}));

export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

export const STATUS_COLORS = {
  available: 'bg-emerald-400/30 border-emerald-400/40 hover:bg-emerald-400/40',
  busy: 'bg-amber-400/30 border-amber-400/40 hover:bg-amber-400/40',
  unavailable: 'bg-slate-400/20 border-slate-400/30 hover:bg-slate-400/30',
  remote: 'bg-blue-400/30 border-blue-400/40 hover:bg-blue-400/40',
  null: 'bg-slate-200/5 border-slate-300/10 hover:bg-slate-200/10'
};

export const STATUS_LABELS = {
  available: 'available',
  busy: 'busy',
  unavailable: 'unavailable',
  remote: 'remote only'
};
