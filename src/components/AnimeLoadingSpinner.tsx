export function AnimeLoadingSpinner() {
  return (
    <div className="flex items-center justify-center space-x-2">
      {/* Cherry blossom petals spinning */}
      <div className="relative w-16 h-16">
        {[0, 1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="absolute inset-0 animate-petal-spin"
            style={{
              animationDelay: `${i * 0.15}s`,
              transform: `rotate(${i * 72}deg)`
            }}
          >
            <svg
              className="absolute top-0 left-1/2 -translate-x-1/2"
              width="16"
              height="16"
              viewBox="0 0 16 16"
              fill="none"
            >
              <path
                d="M8 2 Q10 4 8 8 Q6 4 8 2 Z"
                fill="#ffc0e5"
                opacity="0.8"
              />
              <ellipse
                cx="8"
                cy="5"
                rx="2"
                ry="3"
                fill="#ffb3d9"
                opacity="0.6"
              />
            </svg>
          </div>
        ))}
        {/* Center circle */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-3 h-3 rounded-full bg-pink-300/60 animate-pulse" />
        </div>
      </div>
    </div>
  );
}
