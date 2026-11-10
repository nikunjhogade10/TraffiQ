import { useState } from "react";
import {
  Bell,
  RefreshCw,
  Map,
  BarChart2,
  Activity,
  Radio,
  CheckCircle2,
  AlertTriangle,
  Clock,
  WifiOff,
  Navigation,
} from "lucide-react";
import { Screen, TrafficState, SensorTelemetry } from "../../types";
import { BottomNavBar } from "../BottomNavBar";

interface DashboardScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
  sensorTelemetry: SensorTelemetry;
  onRefresh?: () => Promise<void> | void;
}

/* ── Circular Traffic Level Gauge ── */
function TrafficGauge({
  trafficLevel,
  dataSource,
}: {
  trafficLevel: "Low Traffic" | "Moderate Traffic" | "Heavy Traffic";
  dataSource: "LIVE" | "DEMO" | "OFFLINE" | "NOT CONFIGURED";
}) {
  const isOffline = dataSource === "OFFLINE";
  const isHeavy = trafficLevel === "Heavy Traffic" && !isOffline;
  const isModerate = trafficLevel === "Moderate Traffic" && !isOffline;

  const r = 68;
  const cx = 86;
  const cy = 86;
  const circumference = 2 * Math.PI * r;

  // Arc fraction based on traffic severity
  const pct = isOffline ? 0.05 : isHeavy ? 0.88 : isModerate ? 0.55 : 0.25;
  const fill = circumference * pct;
  const gap = circumference - fill;

  const strokeColor = isOffline
    ? "#94A3B8"
    : isHeavy
    ? "#DC2626"
    : isModerate
    ? "#D97706"
    : "#059669";
  const trackColor = isOffline
    ? "#F1F5F9"
    : isHeavy
    ? "#FEE2E2"
    : isModerate
    ? "#FEF3C7"
    : "#ECFDF5";
  const badgeBg = isOffline
    ? "bg-slate-100 text-slate-700 border-slate-200"
    : isHeavy
    ? "bg-rose-50 text-rose-700 border-rose-200"
    : isModerate
    ? "bg-amber-50 text-amber-800 border-amber-200"
    : "bg-emerald-50 text-emerald-800 border-emerald-200";

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-[172px] height-[172px]">
        <svg width="172" height="172" viewBox="0 0 172 172" aria-label={`Traffic Level: ${trafficLevel}`}>
          {/* Background Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={trackColor}
            strokeWidth="11"
          />
          {/* Active Traffic Severity Arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={strokeColor}
            strokeWidth="11"
            strokeDasharray={`${fill} ${gap}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        {/* Center Readout */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-2 text-center pointer-events-none">
          <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase">
            Traffic Status
          </span>
          <span
            className="text-[19px] font-bold tracking-tight leading-tight mt-0.5"
            style={{ color: strokeColor }}
          >
            {isOffline ? "Offline" : trafficLevel.replace(" Traffic", "")}
          </span>
          <span className="text-[10px] text-slate-500 font-medium mt-1">
            Gate Flow Rate
          </span>
        </div>
      </div>

      {/* Traffic Level Status Badge */}
      <div
        className={`flex items-center gap-1.5 px-3 py-1 rounded-full border mt-3 text-xs font-semibold ${badgeBg}`}
      >
        <span
          className="w-1.5 h-1.5 rounded-full"
          style={{ background: strokeColor }}
          aria-hidden="true"
        />
        <span>{isOffline ? "Sensors Offline" : trafficLevel}</span>
      </div>
    </div>
  );
}

export function DashboardScreen({
  navigate,
  trafficState,
  sensorTelemetry,
  onRefresh,
}: DashboardScreenProps) {
  const [isSpinning, setIsSpinning] = useState(false);

  const handleRefreshClick = async () => {
    if (isSpinning) return;
    setIsSpinning(true);
    try {
      if (onRefresh) {
        await onRefresh();
      }
    } finally {
      setTimeout(() => setIsSpinning(false), 600);
    }
  };

  const isOffline = trafficState.dataSource === "OFFLINE";
  const isHeavy = trafficState.trafficLevel === "Heavy Traffic" && !isOffline;
  const isModerate = trafficState.trafficLevel === "Moderate Traffic" && !isOffline;

  // Status icon based on condition
  const StatusIcon = isOffline
    ? WifiOff
    : isHeavy
    ? AlertTriangle
    : isModerate
    ? Clock
    : CheckCircle2;
  const statusIconColor = isOffline
    ? "text-slate-400"
    : isHeavy
    ? "text-rose-600"
    : isModerate
    ? "text-amber-600"
    : "text-emerald-600";
  const advisoryBorder = isOffline
    ? "border-slate-200 bg-slate-50/70"
    : isHeavy
    ? "border-rose-200 bg-rose-50/60"
    : isModerate
    ? "border-amber-200 bg-amber-50/60"
    : "border-emerald-200 bg-emerald-50/60";

  return (
    <div className="flex flex-col h-full bg-slate-50/80">
      {/* ── Institutional Top Bar ── */}
      <header className="flex-shrink-0 bg-white border-b border-slate-200/80 px-4 pt-3 pb-2.5">
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-[#4B168C]" aria-hidden="true" />
              <p className="text-[11px] font-semibold tracking-wider text-[#4B168C] uppercase">
                MIT-ADT University
              </p>
            </div>
            <h1 className="text-[17px] font-bold text-slate-900 tracking-tight leading-snug mt-0.5">
              Main Campus Gate
            </h1>
            <p className="text-[11px] text-slate-500 font-medium">
              Rajbaug Campus • NH 65 Junction
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Quick Alerts Button */}
            <button
              type="button"
              onClick={() => navigate("alerts")}
              aria-label="View alerts"
              className="relative flex items-center justify-center w-9 h-9 rounded-lg bg-slate-100 hover:bg-slate-200/70 text-slate-600 border border-slate-200 transition-colors"
            >
              <Bell size={17} strokeWidth={1.8} />
              {isHeavy && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white" />
              )}
            </button>
          </div>
        </div>

        {/* Status Line & Refresh */}
        <div className="flex items-center justify-between pt-2.5 mt-2 border-t border-slate-100 text-[11px]">
          <div className="flex items-center gap-1.5">
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                sensorTelemetry.rpiNodeStatus === "online" ? "bg-emerald-500" : "bg-rose-500"
              }`}
            />
            <span className="text-slate-600 font-medium">
              {sensorTelemetry.rpiNodeStatus === "online"
                ? "Live Telemetry Active"
                : "Edge Hardware Offline"}
            </span>
            {trafficState.dataSource !== "LIVE" && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400 font-normal">Simulated</span>
              </>
            )}
          </div>

          <button
            type="button"
            onClick={handleRefreshClick}
            aria-label="Refresh telemetry data"
            className="flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          >
            <RefreshCw
              size={12}
              className={`transition-transform duration-500 ${isSpinning ? "rotate-180" : ""}`}
            />
            <span>Refresh</span>
          </button>
        </div>
      </header>

      {/* ── Scrollable Body ── */}
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: "none" }}>
        {/* ── Hero Metric: Traffic Gauge ── */}
        <section
          aria-label="Current traffic status"
          className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-4 flex flex-col items-center"
        >
          <TrafficGauge
            trafficLevel={trafficState.trafficLevel}
            dataSource={trafficState.dataSource}
          />
        </section>

        {/* ── Operational Advisory Banner ── */}
        <section
          aria-label="Travel recommendation"
          className={`rounded-xl border p-3 flex items-start gap-3 transition-colors ${advisoryBorder}`}
        >
          <StatusIcon size={20} className={`mt-0.5 flex-shrink-0 ${statusIconColor}`} />
          <div className="flex-1">
            <p className="text-[12.5px] font-semibold text-slate-900 leading-snug">
              {trafficState.recommendation}
            </p>
            <p className="text-[11px] text-slate-500 font-medium mt-0.5">
              Estimated exit delay: <span className="font-semibold text-slate-800">{trafficState.estimatedDelay}</span>
            </p>
          </div>
        </section>

        {/* ── Telemetry Telemetry Dual Cards ── */}
        <section aria-label="Sensor readings" className="grid grid-cols-2 gap-2.5">
          {/* Flow Activity */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Flow Rate
              </span>
              <Activity size={14} className="text-slate-400" />
            </div>
            <div className="mt-2">
              <p className="text-[17px] font-bold text-slate-900 tracking-tight">
                {isOffline ? "None" : trafficState.motionActivity}
              </p>
              <p className="text-[11px] text-slate-500 font-medium tabular-nums mt-0.5">
                {sensorTelemetry.pirTriggersPerMin} triggers / min
              </p>
            </div>
          </div>

          {/* Queue Clearance */}
          <div className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3 flex flex-col justify-between">
            <div className="flex items-center justify-between text-slate-500">
              <span className="text-[10px] font-semibold uppercase tracking-wider">
                Queue Clearance
              </span>
              <Radio size={14} className="text-slate-400" />
            </div>
            <div className="mt-2">
              <p className="text-[17px] font-bold text-slate-900 tracking-tight tabular-nums">
                {isOffline ? "--" : trafficState.measuredDistance}
              </p>
              <p className="text-[11px] text-slate-500 font-medium mt-0.5">
                Barrier arm distance
              </p>
            </div>
          </div>
        </section>

        {/* ── Primary Navigation Actions ── */}
        <section aria-label="Quick actions" className="space-y-2 pt-1">
          <button
            type="button"
            onClick={() => navigate("live-map")}
            className="w-full flex items-center justify-center gap-2 h-11 rounded-xl bg-[#4B168C] hover:bg-[#3B1170] text-white text-[13px] font-semibold shadow-xs transition-colors"
          >
            <Navigation size={15} />
            <span>Open Live Campus Map</span>
          </button>

          <button
            type="button"
            onClick={() => navigate("gate-traffic-details")}
            className="w-full flex items-center justify-center gap-2 h-10 rounded-xl bg-white hover:bg-slate-50 text-slate-800 border border-slate-200 text-[12.5px] font-medium transition-colors"
          >
            <BarChart2 size={15} className="text-slate-500" />
            <span>View Shift Metrics & Trends</span>
          </button>
        </section>
      </main>

      {/* ── Unified Bottom Navigation Bar ── */}
      <BottomNavBar currentScreen="dashboard" navigate={navigate} hasAlerts={isHeavy} />
    </div>
  );
}
