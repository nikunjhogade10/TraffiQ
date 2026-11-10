import { useState } from "react";
import { Screen, TrafficState } from "../../types";

interface CriticalAlertScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
}

export function CriticalAlertScreen({ navigate, trafficState }: CriticalAlertScreenProps) {
  const [dismissing, setDismissing] = useState(false);

  function handleDismiss() {
    setDismissing(true);
    setTimeout(() => {
      setDismissing(false);
      navigate("dashboard");
    }, 300);
  }

  return (
    <div style={{ width: "100%", height: "100%", background: "#FFFFFF", display: "flex", flexDirection: "column", opacity: dismissing ? 0 : 1, transition: "opacity 0.3s ease" }}>
      {/* ── Status Bar Area ── */}
      <div
        className="flex items-center justify-between px-5 pt-3 pb-2 flex-shrink-0"
        style={{ background: "#FEF2F2", borderBottom: "1px solid #FECACA" }}
      >
        <span style={{ fontSize: "11px", fontWeight: 700, color: "#991B1B" }}>
          CRITICAL TRAFFIC ADVISORY
        </span>
        <span
          className="px-2 py-0.5 rounded text-[10px] font-bold"
          style={{ background: "#FEE2E2", color: "#DC2626", border: "1px solid #FCA5A5" }}
        >
          SIMULATED INCIDENT
        </span>
      </div>

      {/* ── Banner Header ── */}
      <div
        style={{
          background: "linear-gradient(160deg, #FFF5F5 0%, #FEF2F2 100%)",
          borderBottom: "1px solid #FECACA",
          padding: "20px 20px 22px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          textAlign: "center",
          gap: 10,
        }}
      >
        <div
          style={{
            width: 56,
            height: 56,
            borderRadius: "50%",
            background: "#DC2626",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            boxShadow: "0 0 0 8px rgba(220,38,38,0.15)",
          }}
        >
          <span style={{ fontSize: "26px" }}>⚠️</span>
        </div>

        <div>
          <h1
            style={{
              margin: "0 0 4px",
              fontSize: "20px",
              fontWeight: 800,
              color: "#17172F",
              lineHeight: 1.2,
            }}
          >
            Heavy Traffic at Main Gate
          </h1>
          <p style={{ margin: 0, fontSize: "12px", color: "#64748B" }}>
            MIT-ADT University • Rajbaug Campus Access Road
          </p>
        </div>

        <div className="flex items-center gap-2 mt-1 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold">
          <span>⚡ Motion Rate: {trafficState.pirTriggersPerMin} triggers/min</span>
          <span>•</span>
          <span>Barrier Dist: {trafficState.measuredDistance}</span>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 20px" }}>
        <p
          style={{
            margin: "0 0 8px",
            fontSize: "11px",
            fontWeight: 700,
            color: "#64748B",
            textTransform: "uppercase",
            letterSpacing: "0.5px",
          }}
        >
          Telemetry Status
        </p>

        {/* Status details */}
        <div className="flex flex-col gap-2 mb-4 text-[12px]">
          <div className="rounded-xl p-3 bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-700">PIR Motion Activity</span>
            <span className="font-bold text-red-600">HIGH PULSE RATE</span>
          </div>
          <div className="rounded-xl p-3 bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-700">Ultrasonic Distance to Barrier</span>
            <span className="font-bold text-red-600">{trafficState.measuredDistance} (Vehicles Queued)</span>
          </div>
          <div className="rounded-xl p-3 bg-slate-50 border border-slate-200 flex items-center justify-between">
            <span className="text-slate-700">Estimated Exit Delay</span>
            <span className="font-bold text-slate-900">{trafficState.estimatedDelay}</span>
          </div>
        </div>

        {/* Travel Recommendation */}
        <div
          className="rounded-2xl p-3.5 mb-4"
          style={{ background: "#FEF2F2", border: "1.5px solid #FCA5A5" }}
        >
          <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#991B1B", marginBottom: "4px" }}>
            Campus Exit Advisory
          </h3>
          <p style={{ fontSize: "11.5px", color: "#B91C1C", lineHeight: 1.4 }}>
            {trafficState.recommendation}. The junction connecting Rajbaug to Pune-Solapur Highway is currently backing up. Consider delaying exit until the sensor trigger rate normalizes.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col gap-2 mt-2">
          <button
            type="button"
            onClick={() => navigate("live-map")}
            className="w-full py-3 rounded-xl font-bold text-white text-[13.5px] transition-all active:scale-[0.98]"
            style={{
              background: "#4B168C",
              border: "1.5px solid #D6A52A",
              cursor: "pointer",
            }}
          >
            🗺️ Inspect Live Map Flow Overlay
          </button>

          <button
            type="button"
            onClick={handleDismiss}
            className="w-full py-2.5 rounded-xl font-semibold text-slate-700 text-[13px] bg-slate-100 hover:bg-slate-200 transition-all"
            style={{ border: "none", cursor: "pointer" }}
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
