// Traditional Nepali decorative patterns and elements
export function NepaliPatterns() {
  return (
    <svg className="hidden">
      <defs>
        {/* Traditional Nepali Temple Window Pattern */}
        <pattern id="temple-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
          <path d="M20 0 L30 10 L30 30 L20 40 L10 30 L10 10 Z" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15"/>
        </pattern>

        {/* Prayer Flag Wave Pattern */}
        <pattern id="prayer-flag-wave" x="0" y="0" width="60" height="20" patternUnits="userSpaceOnUse">
          <path d="M0 10 Q15 5, 30 10 T60 10" fill="none" stroke="currentColor" strokeWidth="1" opacity="0.2"/>
        </pattern>

        {/* Mandala Inspired Circle Pattern */}
        <pattern id="mandala-dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle cx="15" cy="15" r="1.5" fill="currentColor" opacity="0.1"/>
        </pattern>
      </defs>
    </svg>
  );
}

// Prayer Flags Component
export function PrayerFlags() {
  const colors = ['#0080FF', '#FFFFFF', '#DC143C', '#00CC66', '#FFD700'];
  const flagNames = ['Blue', 'White', 'Red', 'Green', 'Yellow'];
  
  return (
    <div className="flex items-center justify-center gap-0">
      {colors.map((color, i) => (
        <div key={i} className="relative" style={{ marginLeft: i > 0 ? '-8px' : '0' }}>
          <svg width="30" height="40" viewBox="0 0 30 40">
            <path 
              d="M5 0 L25 0 L20 20 L25 40 L5 40 Z" 
              fill={color}
              stroke="#666"
              strokeWidth="0.5"
              opacity="0.85"
            />
          </svg>
          <span className="sr-only">{flagNames[i]} Prayer Flag</span>
        </div>
      ))}
    </div>
  );
}

// Traditional Nepali Border Decoration
export function NepaliBorder({ className = "" }: { className?: string }) {
  return (
    <div className={`overflow-hidden ${className}`}>
      <svg width="100%" height="8" preserveAspectRatio="none" viewBox="0 0 1200 8">
        <pattern id="nepali-border" x="0" y="0" width="40" height="8" patternUnits="userSpaceOnUse">
          <rect x="0" y="0" width="4" height="8" fill="#DC143C"/>
          <rect x="8" y="0" width="4" height="8" fill="#FFD700"/>
          <rect x="16" y="0" width="4" height="8" fill="#00CC66"/>
          <rect x="24" y="0" width="4" height="8" fill="#0080FF"/>
          <rect x="32" y="0" width="4" height="8" fill="#FF6600"/>
        </pattern>
        <rect width="1200" height="8" fill="url(#nepali-border)"/>
      </svg>
    </div>
  );
}

// Traditional Nepali Corner Decoration
export function NepaliCornerDecor({ position = "top-left" }: { position?: string }) {
  const rotation = {
    'top-left': '0',
    'top-right': '90',
    'bottom-right': '180',
    'bottom-left': '270'
  }[position] || '0';

  return (
    <div className="absolute" style={{ transform: `rotate(${rotation}deg)` }}>
      <svg width="60" height="60" viewBox="0 0 60 60">
        <path 
          d="M0 0 Q20 0, 30 10 T60 0 L60 10 Q40 10, 30 20 T0 10 Z" 
          fill="#DC143C" 
          opacity="0.3"
        />
        <path 
          d="M0 12 Q15 12, 22 19 T45 12" 
          fill="none" 
          stroke="#FFD700" 
          strokeWidth="1.5"
          opacity="0.5"
        />
      </svg>
    </div>
  );
}

// Mountain Silhouette (Himalayan)
export function MountainSilhouette({ className = "" }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 1200 200" preserveAspectRatio="none">
      <defs>
        <linearGradient id="mountain-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#003366" stopOpacity="0.4"/>
          <stop offset="100%" stopColor="#003366" stopOpacity="0.1"/>
        </linearGradient>
      </defs>
      {/* Multiple mountain peaks for Himalayan range effect */}
      <path 
        d="M0 200 L150 80 L300 130 L450 40 L600 90 L750 50 L900 110 L1050 70 L1200 140 L1200 200 Z" 
        fill="url(#mountain-gradient)"
      />
      <path 
        d="M0 200 L200 110 L400 150 L600 60 L800 120 L1000 80 L1200 160 L1200 200 Z" 
        fill="url(#mountain-gradient)"
        opacity="0.6"
      />
    </svg>
  );
}

// Traditional Nepali Lotus Decoration
export function LotusDecor({ className = "" }: { className?: string }) {
  return (
    <svg className={className} width="40" height="40" viewBox="0 0 40 40">
      <g transform="translate(20,20)">
        {/* Lotus petals */}
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => (
          <ellipse 
            key={i}
            cx="0" 
            cy="-10" 
            rx="4" 
            ry="10" 
            fill="#DC143C"
            opacity="0.6"
            transform={`rotate(${angle})`}
          />
        ))}
        {/* Center */}
        <circle cx="0" cy="0" r="3" fill="#FFD700" opacity="0.8"/>
      </g>
    </svg>
  );
}
