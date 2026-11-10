import { useEffect, useState } from "react";

interface SplashScreenProps {
  onFinish: () => void;
  durationMs?: number;
}

export function SplashScreen({ onFinish, durationMs = 1800 }: SplashScreenProps) {
  const [fading, setFading] = useState(false);

  useEffect(() => {
    // Start fade out 350ms before duration ends
    const fadeTimer = setTimeout(() => {
      setFading(true);
    }, Math.max(durationMs - 350, 500));

    // Finish and unmount
    const finishTimer = setTimeout(() => {
      onFinish();
    }, durationMs);

    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(finishTimer);
    };
  }, [onFinish, durationMs]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-between px-6 py-12 select-none transition-opacity duration-300 ease-out ${
        fading ? "opacity-0 pointer-events-none" : "opacity-100"
      }`}
      style={{
        background: "radial-gradient(circle at 50% 40%, #2A0E54 0%, #170730 65%, #0F0420 100%)",
      }}
      aria-label="TraffiQ Loading Screen"
    >
      {/* Top spacer */}
      <div className="w-full flex justify-end">
        <span className="text-[10px] font-semibold text-purple-300/60 uppercase tracking-widest px-2.5 py-1 rounded-full bg-purple-950/40 border border-purple-800/40">
          Main Gate Sensor Node
        </span>
      </div>

      {/* Center Hero: Logo + Title */}
      <div className="flex flex-col items-center text-center -mt-6">
        {/* Animated App Emblem */}
        <div className="relative mb-6">
          {/* Subtle Outer Glow */}
          <div className="absolute inset-0 rounded-3xl bg-[#D6A52A]/20 blur-xl animate-pulse" />

          <div
            className="relative w-24 h-24 rounded-3xl flex items-center justify-center border border-[#D6A52A]/60 shadow-2xl"
            style={{
              background: "linear-gradient(145deg, #240B48 0%, #15062C 100%)",
              boxShadow: "0 12px 32px rgba(15, 4, 32, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.15)",
            }}
          >
            <svg width="56" height="56" viewBox="0 0 30 30" fill="none">
              {/* Radar Waves */}
              <path
                d="M8.5 9.5C9.8 8.2 11.6 7.4 13.5 7.4"
                stroke="#D6A52A"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
              <circle cx="8.5" cy="12.5" r="1.3" fill="#D6A52A" />

              {/* Campus Gate Arch */}
              <path
                d="M9.5 24V14C9.5 10.96 11.96 8.5 15 8.5C18.04 8.5 20.5 10.96 20.5 14V24"
                stroke="#FFFFFF"
                strokeWidth="2.4"
                strokeLinecap="round"
              />

              {/* Gold Barrier Arm */}
              <path
                d="M7 19.5H23"
                stroke="#D6A52A"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
              <circle cx="11" cy="19.5" r="1.5" fill="#FFFFFF" />

              {/* Base Pillars */}
              <path
                d="M7.5 24H11.5M18.5 24H22.5"
                stroke="#FFFFFF"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>

        {/* Brand Name */}
        <h1 className="text-4xl font-black tracking-tight text-white mb-1.5 flex items-center justify-center">
          <span>Traffi</span>
          <span className="text-[#D6A52A] ml-0.5">Q</span>
        </h1>

        {/* University Subtitle */}
        <p className="text-[11.5px] font-bold text-purple-200/90 tracking-widest uppercase mb-1">
          MIT-ADT UNIVERSITY • RAJBAUG
        </p>
        <p className="text-[12px] text-purple-300/70 font-medium">
          Smart Traffic & Main Gate Commute System
        </p>
      </div>

      {/* Bottom Loading Indicator */}
      <div className="w-full max-w-[200px] flex flex-col items-center">
        {/* Animated Loading Bar */}
        <div className="w-full h-1 bg-purple-950/80 rounded-full overflow-hidden border border-purple-800/40 mb-3">
          <div
            className="h-full bg-gradient-to-r from-[#D6A52A] to-purple-400 rounded-full animate-[loadingSlide_1.6s_ease-in-out_infinite]"
            style={{ width: "45%" }}
          />
        </div>

        <p className="text-[10.5px] font-medium text-purple-300/50">
          Connecting to campus telemetry…
        </p>
      </div>

      {/* Keyframe Animation */}
      <style>{`
        @keyframes loadingSlide {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(120%); }
          100% { transform: translateX(250%); }
        }
      `}</style>
    </div>
  );
}

