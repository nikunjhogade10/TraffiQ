import { useState } from "react";
import { ArrowLeft, AlertTriangle, CheckCircle2, Info, Bell } from "lucide-react";
import { Screen, TrafficState, SensorTelemetry } from "../../types";
import { BottomNavBar } from "../BottomNavBar";

interface AlertsScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
  sensorTelemetry: SensorTelemetry;
}

export function AlertsScreen({ navigate, trafficState, sensorTelemetry }: AlertsScreenProps) {
  const [filter, setFilter] = useState<"all" | "traffic">("all");

  const isHeavy = trafficState.trafficLevel === "Heavy Traffic";
  const isOffline = trafficState.dataSource === "OFFLINE";

  // Production alert list
  const alertsList = [
    ...(isHeavy
      ? [
          {
            id: "heavy-alert",
            type: "traffic",
            severity: "critical",
            title: "Heavy Traffic Congestion at Main Gate",
            body: "Sensor motion activity indicates high queue congestion near the barrier arm. Delays expected exiting towards Pune-Solapur Highway.",
            time: "Live • Active Now",
          },
        ]
      : []),
    ...(isOffline
      ? [
          {
            id: "offline-alert",
            type: "traffic",
            severity: "warning",
            title: "Sensor Edge Telemetry Standby",
            body: "Raspberry Pi edge telemetry is offline. Gate queue estimates are suspended until connection is restored.",
            time: "Live • Active Now",
          },
        ]
      : []),
    {
      id: "normal-flow",
      type: "traffic",
      severity: "info",
      title: "Real-time Telemetry Active",
      body: "PIR motion sensor and dual HC-SR04 ultrasonic distance telemetry are feeding real-time updates.",
      time: "Main Gate • Active",
    },
    {
      id: "campus-scope",
      type: "traffic",
      severity: "info",
      title: "Monitored Route Notice",
      body: "Monitoring the Main Campus Gate at Rajbaug Campus connecting to NH 65.",
      time: "Campus Transit Notice",
    },
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
              Alerts &amp; Notices
            </h1>
            <p className="text-[10.5px] text-slate-500 font-medium">
              Main Campus Gate • Operational Log
            </p>
          </div>
        </div>

        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-100 text-slate-700 border border-slate-200">
          {alertsList.length} Events
        </span>
      </header>

      {/* ── Scrollable Body ── */}
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-2.5" style={{ scrollbarWidth: "none" }}>
        {alertsList.map((alert) => {
          const isCrit = alert.severity === "critical";
          const isWarn = alert.severity === "warning";
          const Icon = isCrit ? AlertTriangle : isWarn ? Info : CheckCircle2;
          const iconColor = isCrit
            ? "text-rose-600"
            : isWarn
            ? "text-amber-600"
            : "text-emerald-600";
          const borderClass = isCrit
            ? "border-rose-200 bg-rose-50/40"
            : isWarn
            ? "border-amber-200 bg-amber-50/40"
            : "border-slate-200 bg-white";

          return (
            <article
              key={alert.id}
              className={`rounded-xl border p-3.5 shadow-xs transition-colors ${borderClass}`}
            >
              <div className="flex items-start gap-2.5">
                <Icon size={18} className={`mt-0.5 flex-shrink-0 ${iconColor}`} />
                <div className="flex-1">
                  <div className="flex items-baseline justify-between gap-2">
                    <h2 className="text-[13px] font-bold text-slate-900 leading-snug">
                      {alert.title}
                    </h2>
                  </div>
                  <p className="text-[11.5px] text-slate-600 font-normal leading-relaxed mt-1">
                    {alert.body}
                  </p>
                  <p className="text-[10.5px] text-slate-400 font-medium mt-2">
                    {alert.time}
                  </p>
                </div>
              </div>
            </article>
          );
        })}
      </main>

      {/* ── Unified Bottom Navigation Bar ── */}
      <BottomNavBar currentScreen="alerts" navigate={navigate} hasAlerts={isHeavy} />
    </div>
  );
}
