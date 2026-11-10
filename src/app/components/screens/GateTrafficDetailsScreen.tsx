import {
  ArrowLeft,
  MapPin,
  Activity,
  Radio,
  Clock,
  Cpu,
  Navigation,
} from "lucide-react";
import { Screen, TrafficState, SensorTelemetry } from "../../types";

interface GateTrafficDetailsScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
  sensorTelemetry: SensorTelemetry;
}

type TimelineNode = {
  time: string;
  status: string;
  color: string;
};

export function GateTrafficDetailsScreen({
  navigate,
  trafficState,
  sensorTelemetry,
}: GateTrafficDetailsScreenProps) {
  const isOffline = trafficState.dataSource === "OFFLINE";
  const isHeavy = trafficState.trafficLevel === "Heavy Traffic" && !isOffline;
  const isModerate = trafficState.trafficLevel === "Moderate Traffic" && !isOffline;

  const statusColor = isOffline
    ? "#94A3B8"
    : isHeavy
    ? "#DC2626"
    : isModerate
    ? "#D97706"
    : "#059669";

  const timelineNodes: TimelineNode[] = [
    { time: "4:00 PM", status: "Low", color: "#059669" },
    { time: "4:45 PM", status: "Moderate", color: "#D97706" },
    { time: "5:30 PM", status: isHeavy ? "Heavy" : "Moderate", color: statusColor },
  ];

  return (
    <div className="flex flex-col h-full bg-slate-50/80">
      {/* ── Top Header ── */}
      <header className="flex-shrink-0 flex items-center justify-between px-4 py-3 bg-white border-b border-slate-200/80 shadow-xs">
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate("dashboard")}
            aria-label="Back to dashboard"
            className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 hover:bg-slate-200/70 text-slate-700 transition-colors"
          >
            <ArrowLeft size={16} />
          </button>
          <div>
            <h1 className="text-[16px] font-bold text-slate-900 tracking-tight leading-tight">
              Gate Shift Metrics
            </h1>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Main Campus Gate • Hardware Telemetry Breakdown
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {trafficState.dataSource}
        </span>
      </header>

      {/* ── Scrollable Body ── */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
        {/* Gate Title Card */}
        <section aria-label="Gate identity" className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 flex items-center justify-between">
          <div className="flex items-start gap-2.5">
            <MapPin size={18} className="text-[#4B168C] mt-0.5 flex-shrink-0" />
            <div>
              <h2 className="text-[14px] font-bold text-slate-900">
                Main Campus Gate
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Rajbaug Campus to Pune-Solapur Highway (NH 65)
              </p>
            </div>
          </div>
          <span
            className="px-2.5 py-1 rounded-md text-[11px] font-semibold text-white"
            style={{ background: statusColor }}
          >
            {isOffline ? "Offline" : trafficState.trafficLevel}
          </span>
        </section>

        {/* Telemetry Metric Cards Grid */}
        <section aria-label="Sensor readings" className="grid grid-cols-2 gap-2.5">
          {/* Motion Activity */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                PIR Motion
              </span>
              <Activity size={14} />
            </div>
            <div className="mt-2">
              <p className="text-[16px] font-bold text-slate-900">
                {trafficState.motionActivity}
              </p>
              <p className="text-[11px] text-slate-500 font-medium tabular-nums mt-0.5">
                {sensorTelemetry.pirTriggersPerMin} triggers / min
              </p>
            </div>
          </div>

          {/* Ultrasonic Distance */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Barrier Depth
              </span>
              <Radio size={14} />
            </div>
            <div className="mt-2">
              <p className="text-[16px] font-bold text-slate-900 tabular-nums">
                {trafficState.measuredDistance}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                HC-SR04 distance
              </p>
            </div>
          </div>

          {/* Estimated Exit Delay */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Calculated Delay
              </span>
              <Clock size={14} />
            </div>
            <div className="mt-2">
              <p className="text-[16px] font-bold text-slate-900">
                {trafficState.estimatedDelay}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Exit estimate
              </p>
            </div>
          </div>

          {/* RPi Edge Node State */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-400">
              <span className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
                Edge Node
              </span>
              <Cpu size={14} />
            </div>
            <div className="mt-2">
              <p className="text-[16px] font-bold text-slate-900">
                {sensorTelemetry.rpiNodeStatus === "online" ? "Online" : "Offline"}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Raspberry Pi 3B+
              </p>
            </div>
          </div>
        </section>

        {/* Recent Shift Trend Timeline */}
        <section aria-label="Hourly shift progression" className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
          <h3 className="text-[13px] font-bold text-slate-900">
            Hourly Departure Shift Trend
          </h3>
          <div className="flex justify-between items-center px-4 py-2">
            {timelineNodes.map((node) => (
              <div key={node.time} className="flex flex-col items-center gap-1.5">
                <span className="text-[11px] font-bold" style={{ color: node.color }}>
                  {node.status}
                </span>
                <div
                  className="w-3.5 h-3.5 rounded-full flex items-center justify-center text-white ring-4 ring-slate-100"
                  style={{ background: node.color }}
                />
                <span className="text-[10.5px] text-slate-500 font-medium tabular-nums">{node.time}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => navigate("live-map")}
          className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#4B168C] hover:bg-[#3B1170] text-white text-[13px] font-semibold shadow-xs transition-colors"
        >
          <Navigation size={15} />
          <span>View Main Gate On Live Map</span>
        </button>
      </main>
    </div>
  );
}
