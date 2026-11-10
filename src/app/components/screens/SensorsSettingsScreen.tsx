import { Screen, TrafficState, SensorTelemetry, NotificationSettings } from "../../types";

interface SensorsSettingsScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
  sensorTelemetry: SensorTelemetry;
  notificationSettings: NotificationSettings;
  onUpdateNotifications: (settings: Partial<NotificationSettings>) => void;
  onSimulateState: (preset: "heavy" | "moderate" | "normal" | "offline" | "aws-error" | "live") => void;
}

type NavTab = {
  id: Screen;
  label: string;
  icon: (active: boolean) => React.ReactNode;
};

/* ── SVG Nav Icons with MIT-ADT Purple & Gold ── */
function HomeIcon({ active }: { active: boolean }) {
  const c = active ? "#4B168C" : "#94A3B8";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M3 9.5L11 3l8 6.5V19a1 1 0 01-1 1H14v-5h-4v5H4a1 1 0 01-1-1V9.5z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? "rgba(75, 22, 140, 0.12)" : "none"}
      />
    </svg>
  );
}

function MapIcon({ active }: { active: boolean }) {
  const c = active ? "#4B168C" : "#94A3B8";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M1 5l6-2 8 4 6-2v14l-6 2-8-4-6 2V5z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? "rgba(75, 22, 140, 0.12)" : "none"}
      />
      <path d="M7 3v14M15 7v14" stroke={c} strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function BellIcon({ active }: { active: boolean }) {
  const c = active ? "#4B168C" : "#94A3B8";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <path
        d="M11 2a7 7 0 00-7 7v4l-2 2v1h18v-1l-2-2V9a7 7 0 00-7-7z"
        stroke={c}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill={active ? "rgba(75, 22, 140, 0.12)" : "none"}
      />
      <path d="M9 18a2 2 0 004 0" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function ChartIcon({ active }: { active: boolean }) {
  const c = active ? "#4B168C" : "#94A3B8";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <rect x="2" y="12" width="4" height="8" rx="1" stroke={c} strokeWidth="1.6" fill={active ? "rgba(75, 22, 140, 0.12)" : "none"} />
      <rect x="9" y="7" width="4" height="13" rx="1" stroke={c} strokeWidth="1.6" fill={active ? "rgba(75, 22, 140, 0.12)" : "none"} />
      <rect x="16" y="3" width="4" height="17" rx="1" stroke={c} strokeWidth="1.6" fill={active ? "rgba(75, 22, 140, 0.12)" : "none"} />
    </svg>
  );
}

function UserProfileIcon({ active }: { active: boolean }) {
  const c = active ? "#4B168C" : "#94A3B8";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="7" r="4" stroke={c} strokeWidth="1.8" fill={active ? "rgba(75, 22, 140, 0.12)" : "none"} />
      <path d="M3 19c0-4 3.6-7 8-7s8 3 8 7" stroke={c} strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

/* ── Toggle Switch ── */
function ToggleSwitch({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={on}
      onClick={onToggle}
      className="flex-shrink-0 transition-all duration-200"
      style={{
        width: "44px",
        height: "26px",
        borderRadius: "13px",
        background: on ? "#4B168C" : "#E2E8F0",
        border: "none",
        cursor: "pointer",
        position: "relative",
        padding: 0,
      }}
    >
      <span
        style={{
          position: "absolute",
          top: "3px",
          left: on ? "21px" : "3px",
          width: "20px",
          height: "20px",
          borderRadius: "50%",
          background: "#FFFFFF",
          boxShadow: "0 1px 4px rgba(0,0,0,0.2)",
          transition: "left 0.2s ease",
        }}
      />
    </button>
  );
}

export function SensorsSettingsScreen({
  navigate,
  trafficState,
  sensorTelemetry,
  notificationSettings,
  onUpdateNotifications,
  onSimulateState,
}: SensorsSettingsScreenProps) {
  const navTabs: NavTab[] = [
    { id: "dashboard", label: "Home", icon: (a) => <HomeIcon active={a} /> },
    { id: "live-map", label: "Live Map", icon: (a) => <MapIcon active={a} /> },
    { id: "alerts", label: "Alerts", icon: (a) => <BellIcon active={a} /> },
    { id: "analytics", label: "Analytics", icon: (a) => <ChartIcon active={a} /> },
    { id: "profile", label: "Profile", icon: (a) => <UserProfileIcon active={a} /> },
  ];

  const isPirOnline = sensorTelemetry.pirStatus === "online";
  const isUltraOnline = sensorTelemetry.ultrasonicStatus === "online";
  const isRpiOnline = sensorTelemetry.rpiNodeStatus === "online";
  const isAwsConnected = sensorTelemetry.awsIotStatus === "connected";

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#F7F4FB" }}
    >
      {/* ── Top Header ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-5 pt-3 pb-3"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #EADBFA" }}
      >
        <div className="flex items-center gap-2.5">
          <button
            type="button"
            onClick={() => navigate("dashboard")}
            aria-label="Back to dashboard"
            className="flex items-center justify-center w-11 h-11 rounded-lg transition-all active:scale-90"
            style={{ background: "#F0EAF7", border: "1px solid #EADBFA", cursor: "pointer" }}
          >
            <span style={{ fontSize: "12px", color: "#4B168C" }}>◀</span>
          </button>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#17172F", lineHeight: 1.1 }}>
              System &amp; Diagnostics
            </h1>
            <p style={{ fontSize: "11px", color: "#6B6B80" }}>
              Main Campus Gate • IoT Telemetry
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={() => navigate("profile")}
          className="px-2.5 py-1 rounded-xl text-[11px] font-bold"
          style={{ background: "#F0EAF7", border: "1px solid #EADBFA", color: "#4B168C", cursor: "pointer" }}
        >
          About Scope
        </button>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4" style={{ scrollbarWidth: "none" }}>

        {/* ── Monitored Gate Badge ── */}
        <div
          className="rounded-2xl p-3 mb-3.5 flex items-center justify-between"
          style={{ background: "#FFFFFF", border: "1.5px solid #EADBFA" }}
        >
          <div className="flex items-center gap-2.5">
            <span style={{ fontSize: "18px" }}>📍</span>
            <div>
              <p style={{ fontSize: "13.5px", fontWeight: 700, color: "#17172F" }}>
                Main Campus Gate
              </p>
              <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                MIT-ADT University, Rajbaug Campus
              </p>
            </div>
          </div>
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold"
            style={{ background: "#F0EAF7", color: "#4B168C" }}
          >
            Active Scope
          </span>
        </div>

        {/* ── Interactive Simulator Section (For Academic Demo) ── */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <p style={{ fontSize: "11px", fontWeight: 800, color: "#17172F", letterSpacing: "0.06em" }}>
              INTERACTIVE SIMULATION CONTROLS
            </p>
            <span
              className="px-2 py-0.5 rounded text-[9.5px] font-bold"
              style={{ background: "#FEF3C7", color: "#B45309" }}
            >
              Academic Demo Mode
            </span>
          </div>

          <div
            className="rounded-2xl p-3.5"
            style={{
              background: "#FFFFFF",
              border: "1.5px solid #D6A52A",
              boxShadow: "0 2px 8px rgba(214,165,42,0.12)",
            }}
          >
            <p style={{ fontSize: "11.5px", color: "#4B168C", marginBottom: "10px", lineHeight: 1.4 }}>
              Trigger sample conditions to verify that Dashboard gauges, Live Map approach road colors, and Alerts update in sync:
            </p>

            <div className="grid grid-cols-3 gap-2">
              {/* Heavy */}
              <button
                type="button"
                onClick={() => onSimulateState("heavy")}
                className="py-2 px-1 rounded-xl text-[11px] font-bold transition-all active:scale-95"
                style={{
                  background: trafficState.trafficLevel === "Heavy Traffic" && trafficState.dataSource !== "OFFLINE" ? "#DC2626" : "#F8FAFC",
                  color: trafficState.trafficLevel === "Heavy Traffic" && trafficState.dataSource !== "OFFLINE" ? "#FFFFFF" : "#17172F",
                  border: "1px solid #CBD5E1",
                  cursor: "pointer",
                }}
              >
                🔴 Heavy Traffic
              </button>

              {/* Moderate */}
              <button
                type="button"
                onClick={() => onSimulateState("moderate")}
                className="py-2 px-1 rounded-xl text-[11px] font-bold transition-all active:scale-95"
                style={{
                  background: trafficState.trafficLevel === "Moderate Traffic" && trafficState.dataSource !== "OFFLINE" ? "#EA580C" : "#F8FAFC",
                  color: trafficState.trafficLevel === "Moderate Traffic" && trafficState.dataSource !== "OFFLINE" ? "#FFFFFF" : "#17172F",
                  border: "1px solid #CBD5E1",
                  cursor: "pointer",
                }}
              >
                🟠 Moderate Flow
              </button>

              {/* Low */}
              <button
                type="button"
                onClick={() => onSimulateState("normal")}
                className="py-2 px-1 rounded-xl text-[11px] font-bold transition-all active:scale-95"
                style={{
                  background: trafficState.trafficLevel === "Low Traffic" && trafficState.dataSource !== "OFFLINE" ? "#16A34A" : "#F8FAFC",
                  color: trafficState.trafficLevel === "Low Traffic" && trafficState.dataSource !== "OFFLINE" ? "#FFFFFF" : "#17172F",
                  border: "1px solid #CBD5E1",
                  cursor: "pointer",
                }}
              >
                🟢 Low / Clear
              </button>

              {/* Offline */}
              <button
                type="button"
                onClick={() => onSimulateState("offline")}
                className="py-2 px-1 rounded-xl text-[11px] font-bold transition-all active:scale-95"
                style={{
                  background: !isPirOnline ? "#475569" : "#F8FAFC",
                  color: !isPirOnline ? "#FFFFFF" : "#17172F",
                  border: "1px solid #CBD5E1",
                  cursor: "pointer",
                }}
              >
                🔌 Sensor Offline
              </button>

              {/* AWS Error */}
              <button
                type="button"
                onClick={() => onSimulateState("aws-error")}
                className="py-2 px-1 rounded-xl text-[11px] font-bold transition-all active:scale-95"
                style={{
                  background: !isAwsConnected ? "#DC2626" : "#F8FAFC",
                  color: !isAwsConnected ? "#FFFFFF" : "#17172F",
                  border: "1px solid #CBD5E1",
                  cursor: "pointer",
                }}
              >
                ☁️ AWS Disconnect
              </button>

              {/* Reset / Recover */}
              <button
                type="button"
                onClick={() => onSimulateState("normal")}
                className="py-2 px-1 rounded-xl text-[11px] font-bold transition-all active:scale-95"
                style={{
                  background: "#4B168C",
                  color: "#FFFFFF",
                  border: "1px solid #4B168C",
                  cursor: "pointer",
                }}
              >
                🔄 Reset Normal
              </button>

              {/* Live Hardware Stream */}
              <button
                type="button"
                onClick={() => onSimulateState("live")}
                className="py-2.5 px-2 rounded-xl text-[11px] font-bold transition-all active:scale-95 col-span-3 mt-1"
                style={{
                  background: trafficState.dataSource === "LIVE" ? "#16A34A" : "#F0EAF7",
                  color: trafficState.dataSource === "LIVE" ? "#FFFFFF" : "#4B168C",
                  border: trafficState.dataSource === "LIVE" ? "1.5px solid #15803D" : "1.5px solid #4B168C",
                  cursor: "pointer",
                }}
              >
                {trafficState.dataSource === "LIVE" ? "🟢 Streaming Live from Raspberry Pi 3B+ (Active)" : "⚡ Connect Live to Raspberry Pi 3B+ (192.168.1.14)"}
              </button>
            </div>
          </div>
        </div>

        {/* ── Hardware Diagnostics Section ── */}
        <div className="mb-4">
          <p style={{ fontSize: "11px", fontWeight: 800, color: "#17172F", letterSpacing: "0.06em", marginBottom: "6px" }}>
            HARDWARE &amp; SENSOR TELEMETRY
          </p>

          <div
            className="rounded-2xl p-3.5 flex flex-col gap-3"
            style={{ background: "#FFFFFF", border: "1px solid #EADBFA", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
          >
            {/* PIR Motion Sensor */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ background: isPirOnline ? "#DCFCE7" : "#FEE2E2" }}
                >
                  <span style={{ fontSize: "14px" }}>⚡</span>
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#17172F" }}>
                    PIR Motion Sensor
                  </p>
                  <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                    GPIO 17 • Activity: {sensorTelemetry.pirTriggersPerMin} triggers/min
                  </p>
                </div>
              </div>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{
                  background: isPirOnline ? "#DCFCE7" : "#FEE2E2",
                  color: isPirOnline ? "#15803D" : "#B91C1C",
                }}
              >
                {isPirOnline ? "Online (Demo)" : "Offline"}
              </span>
            </div>

            <div className="h-px bg-slate-100" />

            {/* HC-SR04 Ultrasonic Sensor */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ background: isUltraOnline ? "#DCFCE7" : "#FEE2E2" }}
                >
                  <span style={{ fontSize: "14px" }}>📡</span>
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#17172F" }}>
                    HC-SR04 Ultrasonic Sensor
                  </p>
                  <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                    GPIO 27/22 • Distance: {sensorTelemetry.ultrasonicDistance}
                  </p>
                </div>
              </div>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{
                  background: isUltraOnline ? "#DCFCE7" : "#FEE2E2",
                  color: isUltraOnline ? "#15803D" : "#B91C1C",
                }}
              >
                {isUltraOnline ? "Online (Demo)" : "Offline"}
              </span>
            </div>

            <div className="h-px bg-slate-100" />

            {/* Raspberry Pi Edge Node */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div
                  className="w-11 h-11 rounded-lg flex items-center justify-center"
                  style={{ background: isRpiOnline ? "#F0EAF7" : "#FEE2E2" }}
                >
                  <span style={{ fontSize: "14px" }}>🍓</span>
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#17172F" }}>
                    Raspberry Pi 4 Edge Node
                  </p>
                  <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                    {sensorTelemetry.rpiHardwareNote}
                  </p>
                </div>
              </div>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{
                  background: isRpiOnline ? "#F0EAF7" : "#FEE2E2",
                  color: isRpiOnline ? "#4B168C" : "#B91C1C",
                }}
              >
                {isRpiOnline ? "Configured" : "Offline"}
              </span>
            </div>
          </div>
        </div>

        {/* ── AWS Cloud Ingestion Architecture ── */}
        <div className="mb-4">
          <p style={{ fontSize: "11px", fontWeight: 800, color: "#17172F", letterSpacing: "0.06em", marginBottom: "6px" }}>
            AWS CLOUD INGESTION PIPELINE
          </p>

          <div
            className="rounded-2xl p-3.5 flex flex-col gap-3"
            style={{ background: "#FFFFFF", border: "1px solid #EADBFA", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
          >
            {/* AWS IoT Core */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-lg bg-purple-50 flex items-center justify-center">
                  <span style={{ fontSize: "14px" }}>☁️</span>
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#17172F" }}>
                    AWS IoT Core (MQTT)
                  </p>
                  <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                    Topic: {sensorTelemetry.awsTopic}
                  </p>
                </div>
              </div>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{
                  background: isAwsConnected ? "#DCFCE7" : "#FEE2E2",
                  color: isAwsConnected ? "#15803D" : "#B91C1C",
                }}
              >
                {isAwsConnected ? "Connected" : "Disconnected"}
              </span>
            </div>

            <div className="h-px bg-slate-100" />

            {/* AWS Lambda & DynamoDB */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-11 h-11 rounded-lg bg-amber-50 flex items-center justify-center">
                  <span style={{ fontSize: "14px" }}>⚡</span>
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#17172F" }}>
                    AWS Lambda &amp; DynamoDB
                  </p>
                  <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                    Rule trigger to DynamoDB telemetry store
                  </p>
                </div>
              </div>
              <span
                className="px-2 py-0.5 rounded text-[10px] font-bold"
                style={{ background: "#F0EAF7", color: "#4B168C" }}
              >
                Pipeline Active
              </span>
            </div>
          </div>
        </div>

        {/* ── Notification Toggles ── */}
        <div className="mb-4">
          <p style={{ fontSize: "11px", fontWeight: 800, color: "#17172F", letterSpacing: "0.06em", marginBottom: "6px" }}>
            IN-APP ALERT PREFERENCES
          </p>

          <div
            className="rounded-2xl p-3.5 flex flex-col gap-3"
            style={{ background: "#FFFFFF", border: "1px solid #EADBFA", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#17172F" }}>
                  Heavy Traffic Alerts
                </p>
                <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                  Banner when gate queue congestion occurs
                </p>
              </div>
              <ToggleSwitch
                on={notificationSettings.heavyTrafficAlerts}
                onToggle={() =>
                  onUpdateNotifications({ heavyTrafficAlerts: !notificationSettings.heavyTrafficAlerts })
                }
              />
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#17172F" }}>
                  Traffic Recovery Alerts
                </p>
                <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                  Notify when Main Gate flow clears
                </p>
              </div>
              <ToggleSwitch
                on={notificationSettings.trafficReducingAlerts}
                onToggle={() =>
                  onUpdateNotifications({
                    trafficReducingAlerts: !notificationSettings.trafficReducingAlerts,
                  })
                }
              />
            </div>

            <div className="h-px bg-slate-100" />

            <div className="flex items-center justify-between">
              <div>
                <p style={{ fontSize: "13px", fontWeight: 600, color: "#17172F" }}>
                  Sensor Offline Warning
                </p>
                <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                  Alert if hardware edge node stops reporting
                </p>
              </div>
              <ToggleSwitch
                on={notificationSettings.sensorOfflineAlerts}
                onToggle={() =>
                  onUpdateNotifications({
                    sensorOfflineAlerts: !notificationSettings.sensorOfflineAlerts,
                  })
                }
              />
            </div>
          </div>
        </div>

      </div>

      {/* ── 5 Main Navigation Destinations ── */}
      <div
        className="flex-shrink-0"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #EADBFA",
          boxShadow: "0 -4px 16px rgba(75,22,140,0.05)",
        }}
      >
        <nav aria-label="Main navigation">
          <div className="flex">
            {navTabs.map((tab) => {
              const isActive = false; // SensorsSettings is not a primary nav destination
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => navigate(tab.id)}
                  aria-label={`Go to ${tab.label}`}
                  aria-current={isActive ? "page" : undefined}
                  className="flex-1 flex flex-col items-center justify-center gap-1 py-2.5 transition-all duration-150 active:scale-95"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                >
                  {tab.icon(isActive)}
                  <span
                    style={{
                      fontSize: "9px",
                      fontWeight: isActive ? 700 : 500,
                      color: isActive ? "#4B168C" : "#94A3B8",
                      letterSpacing: "0.01em",
                    }}
                  >
                    {tab.label}
                  </span>
                  {isActive && (
                    <span
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ background: "#D6A52A", marginTop: "-2px" }}
                      aria-hidden="true"
                    />
                  )}
                </button>
              );
            })}
          </div>
        </nav>
        <div className="flex justify-center pb-2 pt-1">
          <div
            className="w-24 h-1 rounded-full"
            style={{ background: "#17172F", opacity: 0.15 }}
            aria-hidden="true"
          />
        </div>
      </div>
    </div>
  );
}
