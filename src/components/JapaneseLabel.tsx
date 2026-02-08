interface JapaneseLabelProps {
  en: string;
  jp: string;
  className?: string;
}

export function JapaneseLabel({ en, jp, className = '' }: JapaneseLabelProps) {
  return (
    <div className={`flex flex-col items-center gap-0.5 ${className}`}>
      <span className="hangyaku-font text-sm">{en}</span>
      <span className="text-[10px] text-pink-200/40 tracking-wider">{jp}</span>
    </div>
  );
}
