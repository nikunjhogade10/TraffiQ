import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  LineChart,
  Line,
} from "recharts";
import {
  ArrowLeft,
  Clock,
  Radio,
  Calendar,
  MapPin,
  TrendingUp,
  CheckCircle2,
  AlertTriangle,
  Activity,
} from "lucide-react";
import { Screen, TrafficState, HistoricalRecord } from "../../types";
import { BottomNavBar } from "../BottomNavBar";

interface AnalyticsScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
}

// Color scale for calculated delays based on traffic standards
function getDelayBarColor(delayMins: number): string {
  if (delayMins <= 3) return "#059669"; // Fast (< 3 mins)
  if (delayMins <= 6) return "#D97706"; // Moderate (3–6 mins)
  return "#DC2626"; // Peak Queue (> 6 mins)
}

export function AnalyticsScreen({ navigate, trafficState }: AnalyticsScreenProps) {
  const [activeTab, setActiveTab] = useState<"delays" | "distances" | "best-times">("delays");

  const isLive = trafficState.dataSource === "LIVE";
  const isHeavy = trafficState.trafficLevel === "Heavy Traffic";
  const isModerate = trafficState.trafficLevel === "Moderate Traffic";

  // Use the actual historical records collected by the Raspberry Pi hardware
  const rawHistory: HistoricalRecord[] =
    trafficState.history && trafficState.history.length > 0
      ? trafficState.history
      : [
          {
            time: new Date().toLocaleTimeString("en-IN", { hour12: false }),
            displayTime: "Now",
            timestamp: new Date().toISOString(),
            distance: parseFloat(trafficState.measuredDistance) || 0.6,
            trafficLevel: trafficState.trafficLevel,
            delayMins: isHeavy ? 12 : isModerate ? 5 : 1,
            flow: isHeavy ? "Heavy Queue" : isModerate ? "Moderate Flow" : "Free Flow",
            pirTriggers: trafficState.pirTriggersPerMin,
            motionActivity: trafficState.motionActivity,
          },
        ];

  // Map actual data points for charts
  const actualChartData = rawHistory.map((item, idx) => ({
    index: idx + 1,
    time: item.time,
    displayTime: item.displayTime,
    delayMins: item.delayMins,
    distance: item.distance,
    flow: item.flow,
    trafficLevel: item.trafficLevel,
    pirTriggers: item.pirTriggers,
  }));

  // Calculate real metrics from actual readings
  const totalReadings = actualChartData.length;
  const avgDistance = (
    actualChartData.reduce((acc, curr) => acc + curr.distance, 0) / (totalReadings || 1)
  ).toFixed(2);
  const maxDelay = Math.max(...actualChartData.map((d) => d.delayMins), 1);

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
              Gate Traffic Analytics
            </h1>
            <p className="text-[10.5px] text-slate-500 font-medium">
              MIT-ADT Main Campus Gate • Edge Telemetry
            </p>
          </div>
        </div>

        <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border-emerald-200">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
          <span>{totalReadings} Readings</span>
        </span>
      </header>

      {/* ── Tab Switcher ── */}
      <nav aria-label="Analytics categories" className="flex-shrink-0 px-4 py-2 bg-white border-b border-slate-200/80 flex items-center gap-1.5 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab("delays")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${
            activeTab === "delays"
              ? "bg-[#4B168C] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <Clock size={13} />
          <span>Exit Delays</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("distances")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${
            activeTab === "distances"
              ? "bg-[#4B168C] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <Radio size={13} />
          <span>Queue Clearance</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("best-times")}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex-shrink-0 ${
            activeTab === "best-times"
              ? "bg-[#4B168C] text-white shadow-xs"
              : "bg-slate-100 text-slate-600 hover:bg-slate-200/60"
          }`}
        >
          <Calendar size={13} />
          <span>Departure Windows</span>
        </button>
      </nav>

      {/* ── Scrollable Body ── */}
      <main className="flex-1 overflow-y-auto px-4 py-3 space-y-3" style={{ scrollbarWidth: "none" }}>
        {/* ── Current Live Summary Strip ── */}
        <section aria-label="Current delay snapshot" className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg flex items-center justify-center bg-slate-100 text-slate-700">
              <Activity size={18} className="text-[#4B168C]" />
            </div>
            <div>
              <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Current Delay
              </p>
              <p className="text-[16px] font-bold text-slate-900 tracking-tight leading-tight">
                {trafficState.estimatedDelay || "< 1 min (Clear)"}
              </p>
            </div>
          </div>

          <div className="text-right">
            <span
              className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border ${
                isHeavy
                  ? "bg-rose-50 text-rose-700 border-rose-200"
                  : isModerate
                  ? "bg-amber-50 text-amber-800 border-amber-200"
                  : "bg-emerald-50 text-emerald-800 border-emerald-200"
              }`}
            >
              {trafficState.trafficLevel}
            </span>
            <p className="text-[11px] text-slate-500 font-medium mt-1 tabular-nums">
              Clearance: {trafficState.measuredDistance}
            </p>
          </div>
        </section>

        {/* ── Key Metrics Triple Cards ── */}
        <section aria-label="Summary statistics" className="grid grid-cols-3 gap-2">
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Data Points
            </span>
            <p className="text-[15px] font-bold text-slate-900 mt-0.5 tabular-nums">
              {totalReadings}
            </p>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Avg Distance
            </span>
            <p className="text-[15px] font-bold text-slate-900 mt-0.5 tabular-nums">
              {avgDistance} m
            </p>
          </div>
          <div className="bg-white p-2.5 rounded-xl border border-slate-200/80 shadow-xs text-center">
            <span className="text-[10px] text-slate-400 font-medium uppercase tracking-wider">
              Peak Delay
            </span>
            <p className="text-[15px] font-bold text-rose-600 mt-0.5 tabular-nums">
              {maxDelay}m
            </p>
          </div>
        </section>

        {/* ── Tab View 1: Delay Timeline ── */}
        {activeTab === "delays" && (
          <section aria-label="Gate delay trend chart" className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
            <div>
              <h2 className="text-[14px] font-bold text-slate-900">
                Gate Delay Trend (Minutes)
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Calculated in real-time from ultrasonic distance and motion triggers
              </p>
            </div>

            <div style={{ width: "100%", height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={actualChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 9.5, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9.5, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any, _name: any, item: any) => [
                      `${val} min delay (${item.payload.flow}, ${item.payload.distance}m)`,
                      "Delay",
                    ]}
                    labelFormatter={(label: any) => `Time: ${label}`}
                    contentStyle={{
                      background: "#0F172A",
                      border: "none",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="delayMins" radius={[4, 4, 0, 0]}>
                    {actualChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getDelayBarColor(entry.delayMins)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="flex items-center justify-around pt-2 border-t border-slate-100 text-[11px]">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
                <span className="text-slate-600 font-medium">Clear (&lt; 3m)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="text-slate-600 font-medium">Moderate (3–6m)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-600" />
                <span className="text-slate-600 font-medium">Queue (&gt; 6m)</span>
              </div>
            </div>
          </section>
        )}

        {/* ── Tab View 2: Distance Curve ── */}
        {activeTab === "distances" && (
          <section aria-label="Distance clearance chart" className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
            <div>
              <h2 className="text-[14px] font-bold text-slate-900">
                Ultrasonic Clearance Distance (Meters)
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Physical sensor depth (closer distance indicates congestion at barrier)
              </p>
            </div>

            <div style={{ width: "100%", height: 180 }}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={actualChartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 9.5, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 9.5, fill: "#64748B" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`${val} m`, "Distance"]}
                    labelFormatter={(label: any) => `Time: ${label}`}
                    contentStyle={{
                      background: "#0F172A",
                      border: "none",
                      borderRadius: "8px",
                      color: "#FFFFFF",
                      fontSize: "11px",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="distance"
                    stroke="#4B168C"
                    strokeWidth={2}
                    dot={{ fill: "#4B168C", r: 3 }}
                    activeDot={{ r: 5, fill: "#DC2626" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </section>
        )}

        {/* ── Tab View 3: Departure Windows ── */}
        {activeTab === "best-times" && (
          <section aria-label="Recommended departure windows" className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-3">
            <div>
              <h2 className="text-[14px] font-bold text-slate-900">
                Optimal Departure Windows
              </h2>
              <p className="text-[11px] text-slate-500 font-medium">
                Recommended exit times to avoid Pune-Solapur Highway merge bottlenecks
              </p>
            </div>

            <div className="space-y-2">
              <div className="p-3 rounded-lg border border-emerald-200 bg-emerald-50/60 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-emerald-700" />
                    <p className="text-[12.5px] font-semibold text-emerald-900">
                      Early Afternoon (2:00 PM – 4:15 PM)
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Free-flow clearance. Minimal queue at the barrier arm.
                  </p>
                </div>
                <span className="text-[10.5px] font-bold text-emerald-800 bg-white border border-emerald-200 px-2 py-0.5 rounded-sm">
                  Recommended
                </span>
              </div>

              <div className="p-3 rounded-lg border border-rose-200 bg-rose-50/60 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle size={14} className="text-rose-700" />
                    <p className="text-[12.5px] font-semibold text-rose-900">
                      Peak Shift End (4:30 PM – 5:45 PM)
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Heavy departure rush. Expect 10–15 min delays merging onto NH 65.
                  </p>
                </div>
                <span className="text-[10.5px] font-bold text-rose-800 bg-white border border-rose-200 px-2 py-0.5 rounded-sm">
                  Heavy Queue
                </span>
              </div>

              <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-1.5">
                    <CheckCircle2 size={14} className="text-slate-600" />
                    <p className="text-[12.5px] font-semibold text-slate-900">
                      Evening Flow (After 6:00 PM)
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-600 mt-1">
                    Steady flow exiting smoothly towards Hadapsar and Loni Kalbhor.
                  </p>
                </div>
                <span className="text-[10.5px] font-bold text-slate-700 bg-white border border-slate-200 px-2 py-0.5 rounded-sm">
                  Normal
                </span>
              </div>
            </div>
          </section>
        )}

        {/* ── Highway Route Strip ── */}
        <section className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-3 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <MapPin size={16} className="text-[#4B168C] flex-shrink-0" />
            <div>
              <p className="text-[12px] font-semibold text-slate-900 leading-tight">
                Pune-Solapur Highway (NH 65)
              </p>
              <p className="text-[10.5px] text-slate-500 font-medium">
                Monitored Exit Route • Rajbaug Campus
              </p>
            </div>
          </div>
          <span className="text-[10px] font-semibold text-slate-600 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
            Active Feed
          </span>
        </section>
      </main>

      {/* ── Unified Bottom Navigation Bar ── */}
      <BottomNavBar currentScreen="analytics" navigate={navigate} />
    </div>
  );
}
