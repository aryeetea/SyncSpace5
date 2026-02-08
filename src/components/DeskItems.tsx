export function DeskItems() {
  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {/* Coffee cup - bottom right */}
      <div className="absolute bottom-8 right-12 opacity-30 hover:opacity-50 transition-opacity duration-500">
        <div className="relative">
          {/* Steam */}
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-steam-1 opacity-40">
              <svg width="20" height="30" viewBox="0 0 20 30">
                <path
                  d="M10 30 Q8 20 10 15 Q12 10 10 0"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          <div className="absolute -top-8 left-1/2 transform -translate-x-1/2">
            <div className="animate-steam-2 opacity-40">
              <svg width="20" height="30" viewBox="0 0 20 30">
                <path
                  d="M10 30 Q12 20 10 15 Q8 10 10 0"
                  stroke="white"
                  strokeWidth="1.5"
                  fill="none"
                  strokeLinecap="round"
                />
              </svg>
            </div>
          </div>
          {/* Cup */}
          <svg width="50" height="60" viewBox="0 0 50 60" fill="none">
            <rect x="10" y="15" width="30" height="35" rx="2" fill="#f8b4d9" opacity="0.6" />
            <ellipse cx="25" cy="15" rx="15" ry="3" fill="#f8b4d9" opacity="0.8" />
            <path d="M40 25 Q50 25 50 35 Q50 45 40 45" stroke="#f8b4d9" strokeWidth="3" opacity="0.6" fill="none" />
          </svg>
        </div>
      </div>

      {/* Potted plant - bottom left */}
      <div className="absolute bottom-8 left-12 opacity-25 hover:opacity-40 transition-opacity duration-500">
        <svg width="60" height="80" viewBox="0 0 60 80" fill="none">
          {/* Pot */}
          <path d="M15 60 L20 80 L40 80 L45 60 Z" fill="#d4a574" opacity="0.7" />
          {/* Leaves */}
          <ellipse cx="25" cy="45" rx="8" ry="15" fill="#7cb342" opacity="0.6" transform="rotate(-20 25 45)" />
          <ellipse cx="30" cy="40" rx="8" ry="16" fill="#8bc34a" opacity="0.6" />
          <ellipse cx="35" cy="45" rx="8" ry="15" fill="#7cb342" opacity="0.6" transform="rotate(20 35 45)" />
          <ellipse cx="28" cy="35" rx="7" ry="14" fill="#9ccc65" opacity="0.6" transform="rotate(-10 28 35)" />
        </svg>
      </div>

      {/* Book stack - top left corner (desktop only) */}
      <div className="hidden lg:block absolute top-20 left-8 opacity-20 hover:opacity-35 transition-opacity duration-500">
        <svg width="80" height="60" viewBox="0 0 80 60" fill="none">
          {/* Book 1 */}
          <rect x="5" y="40" width="50" height="12" rx="1" fill="#b388ff" opacity="0.7" />
          <line x1="5" y1="46" x2="55" y2="46" stroke="#9575cd" strokeWidth="0.5" />
          {/* Book 2 */}
          <rect x="8" y="28" width="48" height="10" rx="1" fill="#81d4fa" opacity="0.7" transform="rotate(2 32 33)" />
          {/* Book 3 */}
          <rect x="10" y="18" width="45" height="9" rx="1" fill="#ffb74d" opacity="0.7" transform="rotate(-1 32.5 22.5)" />
        </svg>
      </div>

      {/* Desk lamp - top right (desktop only) */}
      <div className="hidden lg:block absolute top-16 right-16 opacity-15 hover:opacity-25 transition-opacity duration-500">
        <svg width="70" height="100" viewBox="0 0 70 100" fill="none">
          {/* Light glow */}
          <ellipse cx="25" cy="30" rx="30" ry="15" fill="#fff4e6" opacity="0.3" />
          {/* Lamp shade */}
          <path d="M15 30 L10 40 L40 40 L35 30 Z" fill="#e1bee7" opacity="0.6" />
          {/* Lamp arm */}
          <line x1="25" y1="40" x2="35" y2="70" stroke="#9e9e9e" strokeWidth="2" opacity="0.5" />
          <line x1="35" y1="70" x2="30" y2="90" stroke="#9e9e9e" strokeWidth="2" opacity="0.5" />
          {/* Base */}
          <ellipse cx="30" cy="92" rx="12" ry="4" fill="#757575" opacity="0.5" />
        </svg>
      </div>
    </div>
  );
}
