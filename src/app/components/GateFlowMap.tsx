import { useState } from "react";

interface GateFlowMapProps {
  trafficLevel: "low" | "moderate" | "heavy";
}

export function GateFlowMap({ trafficLevel }: GateFlowMapProps) {
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const roadColor =
    trafficLevel === "heavy"
      ? "#ef4444"
      : trafficLevel === "moderate"
      ? "#f97316"
      : "#22c55e";

  const roadLabel =
    trafficLevel === "heavy"
      ? "Heavy Traffic"
      : trafficLevel === "moderate"
      ? "Moderate Traffic"
      : "Low Traffic";

  return (
    <div className="relative w-full h-full overflow-hidden">
      <svg
        viewBox="0 0 390 580"
        className="w-full h-full"
        style={{ background: "#eae6df" }}
        aria-label="MIT-ADT University campus gate map"
        role="img"
      >
        {/* === MAP BACKGROUND TILES === */}
        {/* Base terrain */}
        <rect width="390" height="580" fill="#eae6df" />

        {/* Distant green zones */}
        <rect x="0" y="0" width="120" height="180" fill="#d8edcc" opacity="0.6" rx="4" />
        <rect x="280" y="0" width="110" height="140" fill="#d8edcc" opacity="0.5" rx="4" />
        <rect x="0" y="350" width="100" height="230" fill="#d8edcc" opacity="0.55" rx="4" />
        <rect x="310" y="420" width="80" height="160" fill="#d8edcc" opacity="0.45" rx="4" />

        {/* Background roads (minor) */}
        <line x1="0" y1="120" x2="130" y2="120" stroke="#ccc8c0" strokeWidth="9" />
        <line x1="60" y1="0" x2="60" y2="200" stroke="#ccc8c0" strokeWidth="7" />
        <line x1="320" y1="0" x2="320" y2="160" stroke="#ccc8c0" strokeWidth="7" />
        <line x1="290" y1="420" x2="390" y2="420" stroke="#ccc8c0" strokeWidth="8" />
        <line x1="50" y1="460" x2="50" y2="580" stroke="#ccc8c0" strokeWidth="7" />

        {/* === CAMPUS BOUNDARY === */}
        {/* Campus fill */}
        <polygon
          points="115,40 310,35 340,55 345,310 315,335 200,345 140,330 110,310 100,200 110,80"
          fill="#e8f4e8"
          stroke="#2563eb"
          strokeWidth="3"
          strokeLinejoin="round"
          strokeDasharray="0"
        />

        {/* Campus inner green areas */}
        <ellipse cx="200" cy="140" rx="55" ry="40" fill="#bbddb0" opacity="0.7" />
        <ellipse cx="270" cy="220" rx="30" ry="22" fill="#bbddb0" opacity="0.6" />
        <ellipse cx="145" cy="230" rx="22" ry="18" fill="#bbddb0" opacity="0.6" />

        {/* Campus buildings (simplified blocks) */}
        <rect x="145" y="75" width="60" height="38" rx="4" fill="#d0c8b8" stroke="#b8b0a0" strokeWidth="1" />
        <rect x="220" y="72" width="55" height="42" rx="4" fill="#cfc8b8" stroke="#b8b0a0" strokeWidth="1" />
        <rect x="155" y="260" width="50" height="35" rx="4" fill="#d0c8b8" stroke="#b8b0a0" strokeWidth="1" />
        <rect x="225" y="255" width="65" height="38" rx="4" fill="#d2ccbc" stroke="#b8b0a0" strokeWidth="1" />
        <rect x="130" y="170" width="30" height="26" rx="3" fill="#d0c8b8" stroke="#b8b0a0" strokeWidth="1" />

        {/* Campus roads inside */}
        <path d="M200,345 L200,295 L200,200 L200,80" stroke="#c8c0b0" strokeWidth="5" fill="none" />
        <path d="M115,200 L345,200" stroke="#c8c0b0" strokeWidth="5" fill="none" />

        {/* === CAMPUS LABEL === */}
        <text x="200" y="108" textAnchor="middle" fill="#1d4ed8" fontSize="10" fontWeight="700" fontFamily="system-ui, sans-serif" letterSpacing="0.5">MIT-ADT UNIVERSITY</text>
        <text x="200" y="120" textAnchor="middle" fill="#3b82f6" fontSize="8" fontFamily="system-ui, sans-serif" opacity="0.85">Loni Kalbhor, Pune</text>

        {/* === MAIN ROADS OUTSIDE GATE === */}
        {/* Horizontal main road (Loni - Kalbhor Road) */}
        <rect x="0" y="354" width="390" height="28" fill="#d6d0c4" />
        <line x1="0" y1="368" x2="390" y2="368" stroke="#b8b0a0" strokeWidth="0.5" strokeDasharray="12,8" />

        {/* Road labels */}
        <text x="40" y="372" fill="#6b6560" fontSize="8" fontFamily="system-ui, sans-serif" fontStyle="italic">Loni - Kalbhor Road</text>

        {/* Vertical road (access road to campus) */}
        <rect x="178" y="340" width="34" height="240" fill="#d6d0c4" />
        <line x1="195" y1="340" x2="195" y2="580" stroke="#b8b0a0" strokeWidth="0.5" strokeDasharray="12,8" />

        {/* === HIGHLIGHTED TRAFFIC SEGMENT === */}
        {/* Red heavy-traffic road outside gate */}
        <rect x="178" y="382" width="34" height="100" fill={roadColor} opacity="0.85" rx="2" />

        {/* Traffic direction arrows */}
        <text x="195" y="415" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">↑</text>
        <text x="195" y="455" textAnchor="middle" fill="white" fontSize="10" fontWeight="700">↓</text>

        {/* === MONITORING ZONE === */}
        <circle
          cx="195"
          cy="358"
          r="70"
          fill="rgba(37,99,235,0.07)"
          stroke="#2563eb"
          strokeWidth="1.5"
          strokeDasharray="5,4"
        />

        {/* === MAIN GATE PIN === */}
        {/* Gate marker base */}
        <g
          onMouseEnter={() => setShowTooltip("gate")}
          onMouseLeave={() => setShowTooltip(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Shadow */}
          <ellipse cx="195" cy="356" rx="10" ry="4" fill="rgba(0,0,0,0.18)" />
          {/* Pin body */}
          <path
            d="M195,310 C180,310 168,322 168,337 C168,355 195,376 195,376 C195,376 222,355 222,337 C222,322 210,310 195,310Z"
            fill="#1d4ed8"
            stroke="white"
            strokeWidth="2"
          />
          {/* Pin icon */}
          <rect x="187" y="326" width="16" height="12" rx="2" fill="white" />
          <rect x="191" y="322" width="8" height="5" rx="1" fill="white" />
          {/* Gate bars */}
          <line x1="190" y1="326" x2="190" y2="338" stroke="#1d4ed8" strokeWidth="1.5" />
          <line x1="195" y1="326" x2="195" y2="338" stroke="#1d4ed8" strokeWidth="1.5" />
          <line x1="200" y1="326" x2="200" y2="338" stroke="#1d4ed8" strokeWidth="1.5" />
        </g>

        {/* Gate label bubble */}
        <rect x="139" y="290" width="112" height="20" rx="10" fill="#1d4ed8" />
        <text x="195" y="304" textAnchor="middle" fill="white" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">Main Campus Gate</text>
        {/* Bubble tail */}
        <polygon points="192,310 198,310 195,315" fill="#1d4ed8" />

        {/* === SENSOR NODE === */}
        <g
          onMouseEnter={() => setShowTooltip("sensor")}
          onMouseLeave={() => setShowTooltip(null)}
          style={{ cursor: "pointer" }}
        >
          {/* Sensor ring pulse */}
          <circle cx="240" cy="375" r="14" fill="rgba(16,185,129,0.15)" stroke="#10b981" strokeWidth="1" strokeDasharray="3,2" />
          <circle cx="240" cy="375" r="9" fill="#10b981" stroke="white" strokeWidth="1.5" />
          {/* Sensor icon (chip-like) */}
          <rect x="236" y="371" width="8" height="8" rx="1.5" fill="white" />
          <line x1="234" y1="373" x2="236" y2="373" stroke="white" strokeWidth="1" />
          <line x1="234" y1="376" x2="236" y2="376" stroke="white" strokeWidth="1" />
          <line x1="244" y1="373" x2="246" y2="373" stroke="white" strokeWidth="1" />
          <line x1="244" y1="376" x2="246" y2="376" stroke="white" strokeWidth="1" />
        </g>

        {/* Sensor label */}
        <rect x="250" y="367" width="96" height="16" rx="8" fill="white" stroke="#10b981" strokeWidth="1" />
        <circle cx="258" cy="375" r="4" fill="#10b981" />
        <text x="265" y="378" fill="#064e3b" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">Live Sensor Node</text>

        {/* === SENSOR TOOLTIP === */}
        {showTooltip === "sensor" && (
          <g>
            <rect x="210" y="340" width="130" height="36" rx="6" fill="#1a1a2e" />
            <text x="275" y="355" textAnchor="middle" fill="white" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif">PIR + Ultrasonic Sensor</text>
            <text x="275" y="368" textAnchor="middle" fill="#a3e635" fontSize="8" fontFamily="system-ui, sans-serif">Raspberry Pi Node • Active</text>
          </g>
        )}

        {/* === TRAFFIC LABEL ON ROAD === */}
        <rect x="215" y="424" width="78" height="18" rx="9" fill={roadColor} />
        <text x="254" y="436" textAnchor="middle" fill="white" fontSize="8" fontWeight="700" fontFamily="system-ui, sans-serif">{roadLabel}</text>

        {/* === CAMPUS BOUNDARY LABEL === */}
        <text x="318" y="200" textAnchor="middle" fill="#2563eb" fontSize="8" fontWeight="600" fontFamily="system-ui, sans-serif" transform="rotate(-90,318,200)">Campus Boundary</text>

        {/* === COMPASS ROSE === */}
        <g transform="translate(355,60)">
          <circle cx="0" cy="0" r="16" fill="white" opacity="0.9" />
          <text x="0" y="-6" textAnchor="middle" fill="#1d4ed8" fontSize="9" fontWeight="700" fontFamily="system-ui, sans-serif">N</text>
          <polygon points="0,-12 2,-4 0,0 -2,-4" fill="#1d4ed8" />
          <polygon points="0,0 2,4 0,12 -2,4" fill="#9ca3af" />
        </g>

        {/* === SCALE BAR === */}
        <g transform="translate(18, 530)">
          <rect x="0" y="0" width="60" height="5" rx="2" fill="#9ca3af" />
          <rect x="0" y="0" width="30" height="5" rx="2" fill="#4b5563" />
          <text x="0" y="-3" fill="#4b5563" fontSize="7" fontFamily="system-ui, sans-serif">0</text>
          <text x="55" y="-3" fill="#4b5563" fontSize="7" fontFamily="system-ui, sans-serif">200m</text>
        </g>

        {/* === SENSOR DISCLAIMER BADGE === */}
        <rect x="8" y="62" width="148" height="20" rx="10" fill="rgba(255,255,255,0.92)" stroke="#e5e7eb" strokeWidth="1" />
        <text x="82" y="76" textAnchor="middle" fill="#6b7280" fontSize="8" fontFamily="system-ui, sans-serif">📡 Sensor-estimated traffic only</text>
      </svg>
    </div>
  );
}
