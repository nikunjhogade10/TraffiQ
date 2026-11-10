# COPYRIGHT REGISTRATION — COMPUTER SOFTWARE
## Statutory Filing Dossier under Form XIV (Indian Copyright Act, 1957)

> **Title of Work:** TraffiQ — MIT-ADT Campus Smart Traffic and Gate Monitoring System  
> **Category of Work:** Computer Software (Literary Work under Section 2(o))  
> **Applicants & Authors:**  
> - **Rajani Sangappa Sajjan**  
> - **Nikunj Santosh Hogade**  
> - **Adwait Pravin Kharade**  
> - **Shriraj Omkar Salunke**  
> - **Arayan Atul Londhe**  
> **Copyright Notice:** Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe.  
> **Project Location:** MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India  
> **Year of Creation:** 2026 | **Jurisdiction:** Pune, Maharashtra, India  

---

## 1. STATEMENT OF AUTHORSHIP & INSTITUTIONAL CONTEXT

### 1.1 Joint Authorship Declaration
We, the applicants:
- **Rajani Sangappa Sajjan**
- **Nikunj Santosh Hogade**
- **Adwait Pravin Kharade**
- **Shriraj Omkar Salunke**
- **Arayan Atul Londhe**
declare that we are the authors and developers of the original computer program titled **"TraffiQ — MIT-ADT Campus Smart Traffic and Gate Monitoring System"**.

### 1.2 Institutional Context & IP Policy Advisory
This software was engineered in connection with project work at **MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune**.

> [!IMPORTANT]
> **Advisory for Applicants:** Intellectual property guidelines arising from projects are governed by institutional intellectual property policies. The applicants should verify the institution's guidelines or obtain an official No Objection Certificate (NOC) / Endorsement from university authorities if required by the institution or the Copyright Office prior to filing.

### 1.3 Consistency Across Application Forms
The particulars stated in this compilation document must correspond strictly with **Form XIV**, the **Statement of Particulars (SoP)**, and all supporting applicant identification records submitted to the Copyright Office.

---

## 2. SYSTEM ARCHITECTURE SPECIFICATION

```mermaid
graph TD
    subgraph Edge Hardware ["Campus Gate IoT Node (Raspberry Pi 4)"]
        PIR["PIR Motion Sensor (GPIO 17)<br/>Motion Trigger Frequency"]
        US["HC-SR04 Ultrasonic (GPIO 27/22)<br/>Barrier Clearance Distance"]
        RPI["Raspberry Pi Edge Controller<br/>Telemetry Normalization (Python)"]
        PIR --> RPI
        US --> RPI
    end

    subgraph Cloud Infrastructure ["AWS Cloud Infrastructure (ap-south-1 Mumbai)"]
        MQTT["AWS IoT Core (MQTT over TLS)<br/>Topic: mitadt/campus/gate/main/telemetry"]
        LAMBDA["AWS Lambda Telemetry Evaluator<br/>Rule Processing & Heuristics"]
        DDB[("Amazon DynamoDB<br/>Historical Telemetry Store")]
        RPI -->|MQTT TLS (Port 8883)| MQTT
        MQTT --> LAMBDA
        LAMBDA --> DDB
    end

    subgraph Frontend Client ["TraffiQ Client Web Application (React + TypeScript)"]
        DASH["Main Gate Dashboard & Circular Gauge"]
        MAP["MapLibre GL JS Real-Time Road Overlay"]
        ANALYTICS["Recharts Hourly Trends & Rush Analysis"]
        SETTINGS["Hardware Diagnostics & Simulator"]
        ALERTS["Real-time Incident Notification Feed"]
        LAMBDA -.->|API / WebSocket Stream| DASH
        LAMBDA -.->|Dynamic GeoJSON Line State| MAP
        DDB -.->|Historical Series Query| ANALYTICS
    end
```

---

## 3. MASTER SOURCE CODE MANIFEST & FILE INDEX

| Sl. | Component / Module Name | File Path | Language | Line Count | Description |
|:---:|:---|:---|:---:|:---:|:---|
| 01 | **Core Domain Types & Telemetry Models** | `src/app/types.ts` | TYPESCRIPT | 61 | Domain interfaces, sensor telemetry schemas, and traffic status types |
| 02 | **Root Application Controller & Simulation Dispatcher** | `src/app/App.tsx` | TSX | 326 | Central navigation controller, telemetry state engine, and preset simulator dispatcher |
| 03 | **Main Campus Gate Dashboard & Circular Gauge Visualizer** | `src/app/components/screens/DashboardScreen.tsx` | TSX | 595 | Real-time telemetry gauge, honest motion activity, barrier clearance, and travel recommendations |
| 04 | **MapLibre GL JS Interactive Campus Road Map** | `src/app/components/screens/LiveMapScreen.tsx` | TSX | 602 | High-precision vector map with dynamic GeoJSON approach road congestion overlay and sensor markers |
| 05 | **IoT Edge Diagnostics & Academic Simulator Screen** | `src/app/components/screens/SensorsSettingsScreen.tsx` | TSX | 636 | Hardware diagnostic feed (GPIO pins, AWS connection) and one-tap scenario simulator controls |
| 06 | **Hourly Telemetry Trends & Recharts Analytics Screen** | `src/app/components/screens/AnalyticsScreen.tsx` | TSX | 376 | Time-series visualization plotting hourly PIR trigger frequency and HC-SR04 barrier clearance trends |
| 07 | **Real-Time Incident & Congestion Alert Feed Screen** | `src/app/components/screens/AlertsScreen.tsx` | TSX | 359 | Categorized notifications for traffic bottlenecks, clearance events, and edge sensor telemetry faults |
| 08 | **Gate Shift Metrics & Queue Diagnostics Screen** | `src/app/components/screens/GateTrafficDetailsScreen.tsx` | TSX | 205 | Gate security shift metrics, estimated queues, and vehicle clearance throughput analytics |
| 09 | **Academic Demo Login & Authentication Screen** | `src/app/components/screens/LoginScreen.tsx` | TSX | 344 | Secure credential entry, demo bypass for evaluators, and visual branding authentication |
| 10 | **Self-Service Password Recovery Screen** | `src/app/components/screens/ForgotPasswordScreen.tsx` | TSX | 239 | Multi-step academic ID verification and automated password recovery workflow |
| 11 | **Critical Congestion Advisory Modal Screen** | `src/app/components/screens/CriticalAlertScreen.tsx` | TSX | 172 | Full-screen high-priority alert for emergency vehicle clearance and severe approach road gridlock |
| 12 | **Campus Profile & Academic Disclosure Screen** | `src/app/components/screens/ProfileScreen.tsx` | TSX | 355 | Institution deployment disclosures, truthful telemetry declaration, and academic project specifications |
| 13 | **Design System Class Merge Utility** | `src/app/components/ui/utils.ts` | TYPESCRIPT | 6 | Tailwind CSS class merger utility supporting conditional styling and component variance |
| 14 | **Raspberry Pi 4 IoT Edge Telemetry Collector** | `src/edge/gate_sensor_node.py` | PYTHON | 234 | Hardware GPIO reader for PIR (GPIO 17) and HC-SR04 (GPIO 27/22) with AWS IoT Core MQTT publisher |
| 15 | **AWS Lambda Cloud Rule Evaluator & DynamoDB Handler** | `src/cloud/lambda_telemetry_processor.py` | PYTHON | 107 | Cloud serverless function evaluating congestion rules, calculating delay, and saving to Amazon DynamoDB |
| 16 | **Application React DOM Entry Point** | `src/main.tsx` | TSX | 7 | Vite React mounting root initiating application rendering and global styling |
| 17 | **MIT-ADT Visual Identity Design System Tokens** | `src/styles/theme.css` | CSS | 181 | Curated color variables (University Purple #4B168C, Gold #D6A52A) and typography tokens |
| 18 | **Vite Build & Bundler Configuration** | `vite.config.ts` | TYPESCRIPT | 41 | Build tooling configuration including Tailwind CSS plugins, React fast refresh, and path aliases |
| 19 | **Project Manifest & Dependency Specifications** | `package.json` | JSON | 92 | NPM package manifest detailing runtime dependencies, dev tools, and build scripts |

**Total Active Modules:** 19  
**Total Compilation Lines of Code:** 4938  

---

## 4. COMPLETE SOURCE CODE LISTINGS

### SECTION 4.01: CORE DOMAIN TYPES & TELEMETRY MODELS
**Target Path:** `src/app/types.ts`  
**Language:** `typescript` | **Line Count:** `61`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```typescript
export type Screen =
  | "login"
  | "forgot-password"
  | "dashboard"
  | "live-map"
  | "gate-traffic-details"
  | "critical-alert"
  | "alerts"
  | "analytics"
  | "sensors-settings"
  | "profile";

export type DataSourceState = "LIVE" | "DEMO" | "OFFLINE" | "NOT CONFIGURED";
export type TrafficLevel = "Low Traffic" | "Moderate Traffic" | "Heavy Traffic";
export type MotionActivityLevel = "None" | "Low" | "Moderate" | "High";

export interface TrafficState {
  gateId: "main";
  gateName: "Main Campus Gate";
  trafficLevel: TrafficLevel;
  dataSource: DataSourceState;
  motionActivity: MotionActivityLevel;
  pirTriggersPerMin: number;
  measuredDistance: string; // HC-SR04 measured distance (e.g. "1.2 m" or "--")
  lastUpdated: string;
  estimatedDelay: string; // Labeled clearly as prototype estimate
  recommendation: string;
  isSimulated: boolean;
  simulatorPreset: "heavy" | "moderate" | "normal" | "offline" | "aws-error";
}

export interface SensorTelemetry {
  pirStatus: "online" | "offline" | "not-configured";
  pirTriggersPerMin: number;
  ultrasonicStatus: "online" | "offline" | "not-configured";
  ultrasonicDistance: string; // e.g. "1.2 m"
  rpiNodeStatus: "online" | "offline" | "not-configured";
  rpiHardwareNote: string; // Truthful: "Prototype breadboard node"
  awsIotStatus: "connected" | "disconnected" | "not-configured";
  awsTopic: string;
  awsRegion: string;
  lastSyncTime: string;
  dataSource: DataSourceState;
}

export interface NotificationSettings {
  heavyTrafficAlerts: boolean;
  trafficReducingAlerts: boolean;
  sensorOfflineAlerts: boolean;
  dailyDigest: boolean;
}

export interface UniversitySystemInfo {
  campusName: string;
  gateName: string;
  location: string;
  prototypeScope: string;
  operatorRole: string;
  appVersion: string;
}


```

---

### SECTION 4.02: ROOT APPLICATION CONTROLLER & SIMULATION DISPATCHER
**Target Path:** `src/app/App.tsx`  
**Language:** `tsx` | **Line Count:** `326`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx
import { useState } from "react";
import { LoginScreen } from "./components/screens/LoginScreen";
import { ForgotPasswordScreen } from "./components/screens/ForgotPasswordScreen";
import { DashboardScreen } from "./components/screens/DashboardScreen";
import { LiveMapScreen } from "./components/screens/LiveMapScreen";
import { GateTrafficDetailsScreen } from "./components/screens/GateTrafficDetailsScreen";
import { CriticalAlertScreen } from "./components/screens/CriticalAlertScreen";
import { AlertsScreen } from "./components/screens/AlertsScreen";
import { AnalyticsScreen } from "./components/screens/AnalyticsScreen";
import { SensorsSettingsScreen } from "./components/screens/SensorsSettingsScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import {
  Screen,
  TrafficState,
  SensorTelemetry,
  NotificationSettings,
  UniversitySystemInfo,
} from "./types";

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");

  // Global Traffic State (Strictly ONE GATE: MIT-ADT Main Campus Gate)
  const [trafficState, setTrafficState] = useState<TrafficState>({
    gateId: "main",
    gateName: "Main Campus Gate",
    trafficLevel: "Low Traffic",
    dataSource: "DEMO",
    motionActivity: "Low",
    pirTriggersPerMin: 6,
    measuredDistance: "6.5 m",
    lastUpdated: "Just now (Simulated)",
    estimatedDelay: "< 1 min (Clear)",
    recommendation: "Clear passage. Free flow exiting onto Pune-Solapur Highway access road.",
    isSimulated: true,
    simulatorPreset: "normal",
  });

  // Global Sensor Telemetry (PIR + HC-SR04 on Raspberry Pi to AWS IoT Core)
  const [sensorTelemetry, setSensorTelemetry] = useState<SensorTelemetry>({
    pirStatus: "online",
    pirTriggersPerMin: 6,
    ultrasonicStatus: "online",
    ultrasonicDistance: "6.5 m",
    rpiNodeStatus: "online",
    rpiHardwareNote: "RPi 4B Breadboard Prototype (ap-south-1)",
    awsIotStatus: "connected",
    awsTopic: "mitadt/campus/gate/main/telemetry",
    awsRegion: "ap-south-1 (Mumbai)",
    lastSyncTime: "Just now",
    dataSource: "DEMO",
  });

  // User In-App Notification Settings
  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    heavyTrafficAlerts: true,
    trafficReducingAlerts: true,
    sensorOfflineAlerts: true,
    dailyDigest: false,
  });

  // System & Campus Information
  const [systemInfo] = useState<UniversitySystemInfo>({
    campusName: "MIT-ADT University, Pune",
    gateName: "Main Campus Gate",
    location: "Rajbaug Campus, Loni Kalbhor, Pune - 412201",
    prototypeScope: "Single-Gate IoT Traffic Monitoring (Phase 1)",
    operatorRole: "Academic Evaluator",
    appVersion: "TraffiQ v1.2",
  });

  const navigate = (target: Screen) => {
    setScreen(target);
  };

  const handleUpdateNotifications = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => ({
      ...prev,
      ...settings,
    }));
  };

  // Interactive Simulator Handler (Synchronizes Dashboard, Map, Alerts & Analytics)
  const handleSimulateState = (preset: "heavy" | "moderate" | "normal" | "offline" | "aws-error") => {
    if (preset === "heavy") {
      setTrafficState({
        gateId: "main",
        gateName: "Main Campus Gate",
        trafficLevel: "Heavy Traffic",
        dataSource: "DEMO",
        motionActivity: "High",
        pirTriggersPerMin: 42,
        measuredDistance: "0.8 m",
        lastUpdated: "Just now (Simulated)",
        estimatedDelay: "10–15 minutes (Queue at Barrier)",
        recommendation: "High congestion at Main Gate. Slow queue exiting towards Solapur Road.",
        isSimulated: true,
        simulatorPreset: "heavy",
      });
      setSensorTelemetry((prev) => ({
        ...prev,
        pirStatus: "online",
        pirTriggersPerMin: 42,
        ultrasonicStatus: "online",
        ultrasonicDistance: "0.8 m",
        rpiNodeStatus: "online",
        awsIotStatus: "connected",
        dataSource: "DEMO",
      }));
    } else if (preset === "moderate") {
      setTrafficState({
        gateId: "main",
        gateName: "Main Campus Gate",
        trafficLevel: "Moderate Traffic",
        dataSource: "DEMO",
        motionActivity: "Moderate",
        pirTriggersPerMin: 20,
        measuredDistance: "3.2 m",
        lastUpdated: "Just now (Simulated)",
        estimatedDelay: "3–5 minutes",
        recommendation: "Steady movement at Main Gate barrier arm.",
        isSimulated: true,
        simulatorPreset: "moderate",
      });
      setSensorTelemetry((prev) => ({
        ...prev,
        pirStatus: "online",
        pirTriggersPerMin: 20,
        ultrasonicStatus: "online",
        ultrasonicDistance: "3.2 m",
        rpiNodeStatus: "online",
        awsIotStatus: "connected",
        dataSource: "DEMO",
      }));
    } else if (preset === "normal") {
      setTrafficState({
        gateId: "main",
        gateName: "Main Campus Gate",
        trafficLevel: "Low Traffic",
        dataSource: "DEMO",
        motionActivity: "Low",
        pirTriggersPerMin: 6,
        measuredDistance: "6.5 m",
        lastUpdated: "Just now (Simulated)",
        estimatedDelay: "< 1 minute",
        recommendation: "Clear passage. Free flow exiting onto Pune-Solapur Highway access road.",
        isSimulated: true,
        simulatorPreset: "normal",
      });
      setSensorTelemetry((prev) => ({
        ...prev,
        pirStatus: "online",
        pirTriggersPerMin: 6,
        ultrasonicStatus: "online",
        ultrasonicDistance: "6.5 m",
        rpiNodeStatus: "online",
        awsIotStatus: "connected",
        dataSource: "DEMO",
      }));
    } else if (preset === "offline") {
      setTrafficState((prev) => ({
        ...prev,
        trafficLevel: "Low Traffic",
        dataSource: "OFFLINE",
        motionActivity: "None",
        pirTriggersPerMin: 0,
        measuredDistance: "--",
        lastUpdated: "Connection Lost (Simulated)",
        estimatedDelay: "Unavailable",
        recommendation: "Sensors offline. Traffic estimate unavailable — please observe physical gate signals.",
        simulatorPreset: "offline",
      }));
      setSensorTelemetry((prev) => ({
        ...prev,
        pirStatus: "offline",
        pirTriggersPerMin: 0,
        ultrasonicStatus: "offline",
        ultrasonicDistance: "--",
        rpiNodeStatus: "offline",
        dataSource: "OFFLINE",
      }));
    } else if (preset === "aws-error") {
      setSensorTelemetry((prev) => ({
        ...prev,
        awsIotStatus: "disconnected",
      }));
      setTrafficState((prev) => ({
        ...prev,
        recommendation: "AWS MQTT telemetry disconnected. Reconnecting to ap-south-1 broker...",
        simulatorPreset: "aws-error",
      }));
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen p-0 sm:p-4"
      style={{
        background: "linear-gradient(135deg, #17172F 0%, #280C4F 50%, #4B168C 100%)",
      }}
    >
      {/* MIT-ADT University Subtle Ambient Glow */}
      <div
        aria-hidden="true"
        style={{
          position: "fixed",
          top: "15%",
          left: "50%",
          transform: "translateX(-50%)",
          width: "700px",
          height: "450px",
          borderRadius: "50%",
          background: "radial-gradient(ellipse, rgba(214,165,42,0.12) 0%, transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* Main Responsive Application Shell (Optimized for Mobile & Desktop) */}
      <div
        className="relative overflow-hidden w-full sm:rounded-[36px]"
        style={{
          maxWidth: "410px",
          height: "100vh",
          maxHeight: "880px",
          background: "#FFFFFF",
          boxShadow: "0 28px 75px rgba(0,0,0,0.55), 0 0 0 1.5px rgba(214,165,42,0.3)",
        }}
      >
        {/* Screen Transitions */}
        <div
          key={screen}
          className="absolute inset-0"
          style={{
            animation: "screenFadeIn 0.22s cubic-bezier(0.2,0.8,0.2,1) both",
          }}
        >
          {screen === "login" && (
            <LoginScreen
              navigate={navigate}
              onGuestLogin={() => navigate("dashboard")}
            />
          )}

          {screen === "forgot-password" && (
            <ForgotPasswordScreen navigate={navigate} />
          )}

          {screen === "dashboard" && (
            <DashboardScreen
              navigate={navigate}
              trafficState={trafficState}
              sensorTelemetry={sensorTelemetry}
            />
          )}

          {screen === "live-map" && (
            <LiveMapScreen
              navigate={navigate}
              trafficState={trafficState}
              sensorTelemetry={sensorTelemetry}
            />
          )}

          {screen === "gate-traffic-details" && (
            <GateTrafficDetailsScreen
              navigate={navigate}
              trafficState={trafficState}
              sensorTelemetry={sensorTelemetry}
            />
          )}

          {screen === "critical-alert" && (
            <CriticalAlertScreen
              navigate={navigate}
              trafficState={trafficState}
            />
          )}

          {screen === "alerts" && (
            <AlertsScreen
              navigate={navigate}
              trafficState={trafficState}
              sensorTelemetry={sensorTelemetry}
            />
          )}

          {screen === "analytics" && (
            <AnalyticsScreen
              navigate={navigate}
              trafficState={trafficState}
            />
          )}

          {screen === "sensors-settings" && (
            <SensorsSettingsScreen
              navigate={navigate}
              trafficState={trafficState}
              sensorTelemetry={sensorTelemetry}
              notificationSettings={notificationSettings}
              onUpdateNotifications={handleUpdateNotifications}
              onSimulateState={handleSimulateState}
            />
          )}

          {screen === "profile" && (
            <ProfileScreen
              navigate={navigate}
              systemInfo={systemInfo}
              trafficState={trafficState}
              notificationSettings={notificationSettings}
              onUpdateNotifications={handleUpdateNotifications}
            />
          )}
        </div>
      </div>

      {/* Screen Animation Styles */}
      <style>{`
        @keyframes screenFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}

```

---

### SECTION 4.03: MAIN CAMPUS GATE DASHBOARD & CIRCULAR GAUGE VISUALIZER
**Target Path:** `src/app/components/screens/DashboardScreen.tsx`  
**Language:** `tsx` | **Line Count:** `595`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx
import { Screen, TrafficState, SensorTelemetry } from "../../types";

interface DashboardScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
  sensorTelemetry: SensorTelemetry;
}

type NavTab = {
  id: Screen;
  label: string;
  icon: (active: boolean) => React.ReactNode;
};

/* ── SVG Nav Icons with MIT-ADT Purple & Gold Accents ── */
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

function SystemIcon({ active }: { active: boolean }) {
  const c = active ? "#4B168C" : "#94A3B8";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="3" stroke={c} strokeWidth="1.8" fill={active ? "rgba(75, 22, 140, 0.12)" : "none"} />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke={c}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
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

  const r = 70;
  const cx = 90;
  const cy = 90;
  const circumference = 2 * Math.PI * r;

  // Arc fraction based on traffic severity
  const pct = isOffline ? 0.05 : isHeavy ? 0.88 : isModerate ? 0.55 : 0.25;
  const fill = circumference * pct;
  const gap = circumference - fill;

  const color = isOffline ? "#64748B" : isHeavy ? "#DC2626" : isModerate ? "#EA580C" : "#16A34A";
  const bgColor = isOffline ? "#E2E8F0" : isHeavy ? "#FEE2E2" : isModerate ? "#FFEDD5" : "#DCFCE7";
  const shadowColor = isOffline
    ? "rgba(100,116,139,0.3)"
    : isHeavy
    ? "rgba(220,38,38,0.4)"
    : isModerate
    ? "rgba(234,88,12,0.4)"
    : "rgba(22,163,74,0.4)";

  return (
    <div className="flex flex-col items-center">
      <div style={{ position: "relative", width: "180px", height: "180px" }}>
        <svg width="180" height="180" viewBox="0 0 180 180" aria-label={`Traffic Level: ${trafficLevel}`}>
          {/* Background Track */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={bgColor}
            strokeWidth="12"
          />
          {/* Active Traffic Severity Arc */}
          <circle
            cx={cx}
            cy={cy}
            r={r}
            fill="none"
            stroke={color}
            strokeWidth="12"
            strokeDasharray={`${fill} ${gap}`}
            strokeDashoffset={circumference * 0.25}
            strokeLinecap="round"
            style={{ filter: `drop-shadow(0 0 6px ${shadowColor})` }}
          />
          {/* Center Canvas */}
          <circle cx={cx} cy={cy} r={r - 16} fill="#FFFFFF" />
        </svg>

        {/* Center Labels */}
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: "0 12px",
          }}
        >
          <span
            style={{
              fontSize: "10px",
              fontWeight: 700,
              color: "#6B6B80",
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              marginBottom: "2px",
            }}
          >
            TRAFFIC SEVERITY
          </span>
          <span
            style={{
              fontSize: "20px",
              fontWeight: 800,
              color: color,
              lineHeight: 1.1,
              fontFamily: "'Inter', system-ui, sans-serif",
              textAlign: "center",
            }}
          >
            {isOffline ? "OFFLINE" : trafficLevel.replace(" Traffic", "").toUpperCase()}
          </span>
          <span
            style={{
              fontSize: "9px",
              fontWeight: 600,
              color: "#94A3B8",
              marginTop: "4px",
              textAlign: "center",
            }}
          >
            PIR &amp; HC-SR04 Estimate
          </span>
        </div>
      </div>

      {/* Traffic Level Status Badge */}
      <div
        className="flex items-center gap-2 px-3.5 py-1 rounded-full mt-3"
        style={{
          background: color,
          boxShadow: `0 3px 10px ${shadowColor}`,
        }}
      >
        <span
          className="w-2 h-2 rounded-full"
          style={{ background: "#FFFFFF", flexShrink: 0 }}
          aria-hidden="true"
        />
        <span style={{ fontSize: "11px", fontWeight: 700, color: "white", letterSpacing: "0.05em" }}>
          {isOffline ? "SENSORS OFFLINE" : trafficLevel.toUpperCase()}
        </span>
      </div>
    </div>
  );
}

export function DashboardScreen({ navigate, trafficState, sensorTelemetry }: DashboardScreenProps) {
  const navTabs: NavTab[] = [
    { id: "dashboard", label: "Home", icon: (a) => <HomeIcon active={a} /> },
    { id: "live-map", label: "Live Map", icon: (a) => <MapIcon active={a} /> },
    { id: "alerts", label: "Alerts", icon: (a) => <BellIcon active={a} /> },
    { id: "analytics", label: "Analytics", icon: (a) => <ChartIcon active={a} /> },
    { id: "sensors-settings", label: "System", icon: (a) => <SystemIcon active={a} /> },
  ];

  const isOffline = trafficState.dataSource === "OFFLINE";
  const isHeavy = trafficState.trafficLevel === "Heavy Traffic" && !isOffline;
  const isModerate = trafficState.trafficLevel === "Moderate Traffic" && !isOffline;

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#F7F4FB", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Status Bar / Campus Header ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-5 pt-3 pb-1"
        aria-hidden="true"
        style={{ height: "42px", background: "#FFFFFF" }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-2.5 h-2.5 rounded-full" style={{ background: "#4B168C" }} />
          <span style={{ fontSize: "12px", fontWeight: 700, color: "#17172F", letterSpacing: "0.03em" }}>
            MIT-ADT UNIVERSITY • RAJBAUG
          </span>
        </div>
        <div className="flex items-center gap-1">
          <span
            className="px-2 py-0.5 rounded text-[10px] font-bold"
            style={{
              background: trafficState.dataSource === "DEMO" ? "#FEF3C7" : isOffline ? "#F1F5F9" : "#DCFCE7",
              color: trafficState.dataSource === "DEMO" ? "#B45309" : isOffline ? "#475569" : "#15803d",
              border: `1px solid ${trafficState.dataSource === "DEMO" ? "#FDE68A" : "#CBD5E1"}`,
            }}
          >
            {trafficState.dataSource === "DEMO" ? "SIMULATED DATA" : trafficState.dataSource}
          </span>
        </div>
      </div>

      {/* ── Gate Title Header Bar (ONE GATE: Main Campus Gate) ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-5 py-3"
        style={{ background: "#FFFFFF", borderBottom: "1px solid #EADBFA" }}
      >
        <div>
          <div className="flex items-center gap-2">
            <h1 style={{ fontSize: "19px", fontWeight: 800, color: "#17172F", lineHeight: 1.2 }}>
              Main Campus Gate
            </h1>
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ background: "#F0EAF7", color: "#4B168C", border: "1px solid #EADBFA" }}
            >
              Phase 1 Scope
            </span>
          </div>
          <p style={{ fontSize: "11px", color: "#6B6B80", marginTop: "2px" }}>
            Connecting Rajbaug Campus to Pune-Solapur Highway (NH 65)
          </p>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Quick link to hardware diagnostics */}
          <button
            type="button"
            onClick={() => navigate("sensors-settings")}
            aria-label="View system & sensor telemetry"
            className="flex items-center justify-center w-8 h-8 rounded-xl transition-all active:scale-90"
            style={{ background: "#F0EAF7", border: "1px solid #EADBFA", cursor: "pointer" }}
            title="System & Sensors"
          >
            <span style={{ fontSize: "13px" }}>⚙️</span>
          </button>

          {/* Incident Alerts Bell */}
          <button
            type="button"
            onClick={() => navigate("alerts")}
            aria-label="View alerts"
            className="relative flex items-center justify-center w-8 h-8 rounded-xl transition-all active:scale-90"
            style={{ background: "#F0EAF7", border: "1px solid #EADBFA", cursor: "pointer" }}
            title="Alerts"
          >
            <span style={{ fontSize: "13px" }}>🔔</span>
            {isHeavy && (
              <span
                className="absolute top-1 right-1 w-2 h-2 rounded-full"
                style={{ background: "#DC2626" }}
              />
            )}
          </button>
        </div>
      </div>

      {/* ── Subheader / Timestamp bar ── */}
      <div
        className="flex-shrink-0 px-5 py-2 flex items-center justify-between text-[11px]"
        style={{ background: "#FAF8FD", borderBottom: "1px solid #F0EAF7" }}
      >
        <span style={{ color: "#6B6B80" }}>
          Status: <strong>{sensorTelemetry.rpiNodeStatus === "online" ? "Monitoring Active" : "Hardware Offline"}</strong>
        </span>
        <span style={{ color: "#6B6B80" }}>
          Updated: <strong>{trafficState.lastUpdated}</strong>
        </span>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-3" style={{ scrollbarWidth: "none" }}>

        {/* ── Circular Traffic Gauge Card ── */}
        <div
          className="rounded-3xl mb-3 flex flex-col items-center"
          style={{
            background: "#FFFFFF",
            border: isOffline
              ? "1.5px solid #E2E8F0"
              : isHeavy
              ? "1.5px solid #FECACA"
              : isModerate
              ? "1.5px solid #FED7AA"
              : "1.5px solid #BBF7D0",
            boxShadow: "0 4px 18px rgba(75, 22, 140, 0.06)",
            padding: "18px 16px 14px",
          }}
        >
          <TrafficGauge trafficLevel={trafficState.trafficLevel} dataSource={trafficState.dataSource} />
        </div>

        {/* ── Travel Recommendation Card ── */}
        <div
          className="rounded-2xl mb-3 flex items-center gap-3 px-3.5 py-3"
          style={{
            background: isOffline ? "#F8FAFC" : isHeavy ? "#FEF2F2" : isModerate ? "#FFF7ED" : "#F0FDF4",
            border: `1.5px solid ${isOffline ? "#CBD5E1" : isHeavy ? "#FCA5A5" : isModerate ? "#FED7AA" : "#BBF7D0"}`,
            boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
          }}
          role="status"
        >
          <span style={{ fontSize: "20px", flexShrink: 0 }} aria-hidden="true">
            {isOffline ? "🔌" : isHeavy ? "⚠️" : isModerate ? "⏳" : "✅"}
          </span>
          <div className="flex-1">
            <p
              style={{
                fontSize: "12.5px",
                fontWeight: 700,
                color: isOffline ? "#334155" : isHeavy ? "#991B1B" : isModerate ? "#9A3412" : "#15803D",
                lineHeight: 1.3,
              }}
            >
              {trafficState.recommendation}
            </p>
            <p
              style={{
                fontSize: "11px",
                color: isOffline ? "#64748B" : isHeavy ? "#B91C1C" : isModerate ? "#C2410C" : "#16A34A",
                marginTop: "2px",
              }}
            >
              Estimated delay: {trafficState.estimatedDelay}
            </p>
          </div>
        </div>

        {/* ── Truthful Sensor Telemetry Metrics Row ── */}
        <div className="grid grid-cols-2 gap-2.5 mb-3">
          {/* Motion Activity (PIR) */}
          <div
            className="rounded-2xl p-3 flex flex-col justify-between"
            style={{
              background: "#FFFFFF",
              border: "1px solid #EADBFA",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#6B6B80", letterSpacing: "0.04em" }}>
                MOTION ACTIVITY
              </span>
              <span style={{ fontSize: "13px" }}>⚡</span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#17172F" }}>
                {isOffline ? "None" : trafficState.motionActivity}
              </span>
              <span style={{ fontSize: "10px", color: "#6B6B80" }}>
                ({sensorTelemetry.pirTriggersPerMin}/min)
              </span>
            </div>
            <span style={{ fontSize: "9.5px", color: "#94A3B8", marginTop: "2px" }}>
              PIR Sensor rate (GPIO 17)
            </span>
          </div>

          {/* Measured Distance (HC-SR04) */}
          <div
            className="rounded-2xl p-3 flex flex-col justify-between"
            style={{
              background: "#FFFFFF",
              border: "1px solid #EADBFA",
              boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
            }}
          >
            <div className="flex items-center justify-between mb-1">
              <span style={{ fontSize: "10px", fontWeight: 700, color: "#6B6B80", letterSpacing: "0.04em" }}>
                MEASURED DISTANCE
              </span>
              <span style={{ fontSize: "13px" }}>📡</span>
            </div>
            <div className="flex items-baseline gap-1">
              <span style={{ fontSize: "18px", fontWeight: 800, color: "#17172F" }}>
                {isOffline ? "--" : trafficState.measuredDistance}
              </span>
              <span style={{ fontSize: "10px", color: "#6B6B80" }}>to barrier</span>
            </div>
            <span style={{ fontSize: "9.5px", color: "#94A3B8", marginTop: "2px" }}>
              HC-SR04 Ultrasonic depth
            </span>
          </div>
        </div>

        {/* ── Main Navigation Action Buttons ── */}
        <div className="flex flex-col gap-2 mb-2">
          {/* 1. Primary Action: View Live Map */}
          <button
            type="button"
            onClick={() => navigate("live-map")}
            className="w-full flex items-center justify-center gap-2 rounded-2xl transition-all duration-150 active:scale-[0.98]"
            style={{
              height: "48px",
              background: "linear-gradient(135deg, #4B168C 0%, #3B1170 100%)",
              boxShadow: "0 4px 14px rgba(75, 22, 140, 0.3)",
              border: "1.5px solid #D6A52A",
              cursor: "pointer",
            }}
            aria-label="Open interactive live campus map"
          >
            <svg width="17" height="17" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M1 4l4-1.5 6 3 4-1.5v10l-4 1.5-6-3-4 1.5V4z" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <span style={{ color: "#FFFFFF", fontSize: "14px", fontWeight: 700, letterSpacing: "0.01em" }}>
              Open Live Campus Map
            </span>
          </button>

          {/* Secondary Actions Row */}
          <div className="flex gap-2">
            {/* View Details */}
            <button
              type="button"
              onClick={() => navigate("gate-traffic-details")}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl transition-all duration-150 active:scale-[0.98]"
              style={{
                height: "44px",
                background: "#FFFFFF",
                border: "1.5px solid #EADBFA",
                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                cursor: "pointer",
              }}
              aria-label="View gate shift trends and metrics"
            >
              <svg width="15" height="15" viewBox="0 0 16 16" fill="none" aria-hidden="true">
                <rect x="2" y="2" width="12" height="12" rx="2" stroke="#4B168C" strokeWidth="1.5" />
                <path d="M5 6h6M5 9h4" stroke="#4B168C" strokeWidth="1.5" strokeLinecap="round" />
              </svg>
              <span style={{ color: "#17172F", fontSize: "13px", fontWeight: 700 }}>
                Gate Metrics
              </span>
            </button>

            {/* View Alerts */}
            <button
              type="button"
              onClick={() => navigate("alerts")}
              className="flex-1 flex items-center justify-center gap-1.5 rounded-2xl transition-all duration-150 active:scale-[0.98]"
              style={{
                height: "44px",
                background: "#FFFFFF",
                border: "1.5px solid #EADBFA",
                boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                cursor: "pointer",
              }}
              aria-label="View notifications and alerts"
            >
              <span style={{ fontSize: "14px" }}>🔔</span>
              <span style={{ color: "#17172F", fontSize: "13px", fontWeight: 700 }}>
                Alerts Feed
              </span>
            </button>
          </div>
        </div>

        {/* ── Demo Mode Advisory Note ── */}
        <div
          className="rounded-xl p-2.5 mt-2 text-center"
          style={{ background: "#F0EAF7", border: "1px dashed #D6A52A" }}
        >
          <p style={{ fontSize: "10.5px", color: "#4B168C", lineHeight: 1.4 }}>
            💡 <strong>Evaluation Note:</strong> Use the <strong>System</strong> tab to switch between Low, Moderate, Heavy, and Offline simulator states to test responsive map and alert triggers.
          </p>
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
              const isActive = tab.id === "dashboard";
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
                      fontSize: "10px",
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

```

---

### SECTION 4.04: MAPLIBRE GL JS INTERACTIVE CAMPUS ROAD MAP
**Target Path:** `src/app/components/screens/LiveMapScreen.tsx`  
**Language:** `tsx` | **Line Count:** `602`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx
import { useEffect, useRef, useState } from "react";
import * as maplibregl from "maplibre-gl";
import type { Map as MapLibreMap } from "maplibre-gl";
import { Screen, TrafficState, SensorTelemetry } from "../../types";

interface LiveMapScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
  sensorTelemetry: SensorTelemetry;
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

function SystemIcon({ active }: { active: boolean }) {
  const c = active ? "#4B168C" : "#94A3B8";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="3" stroke={c} strokeWidth="1.8" fill={active ? "rgba(75, 22, 140, 0.12)" : "none"} />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke={c}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Actual Geographical Coordinates for MIT-ADT University Main Campus Gate (Loni Kalbhor, Pune)
const MAIN_GATE_COORDS: [number, number] = [74.0264, 18.4908]; // [Lng, Lat]
const INITIAL_ZOOM = 16.2;

// Helper to generate polygon circle coordinates for sensor zone (~25m radius)
function createGeoJsonCircle(center: [number, number], radiusInMeters: number, points = 32) {
  const coords: [number, number][] = [];
  const distanceX = radiusInMeters / (111320 * Math.cos((center[1] * Math.PI) / 180));
  const distanceY = radiusInMeters / 110540;

  for (let i = 0; i < points; i++) {
    const theta = (i / points) * (2 * Math.PI);
    const x = distanceX * Math.cos(theta);
    const y = distanceY * Math.sin(theta);
    coords.push([center[0] + x, center[1] + y]);
  }
  coords.push(coords[0]);
  return coords;
}

export function LiveMapScreen({ navigate, trafficState, sensorTelemetry }: LiveMapScreenProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<MapLibreMap | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);
  const [mapReady, setMapReady] = useState(false);
  const [showLegend, setShowLegend] = useState(true);

  const navTabs: NavTab[] = [
    { id: "dashboard", label: "Home", icon: (a) => <HomeIcon active={a} /> },
    { id: "live-map", label: "Live Map", icon: (a) => <MapIcon active={a} /> },
    { id: "alerts", label: "Alerts", icon: (a) => <BellIcon active={a} /> },
    { id: "analytics", label: "Analytics", icon: (a) => <ChartIcon active={a} /> },
    { id: "sensors-settings", label: "System", icon: (a) => <SystemIcon active={a} /> },
  ];

  const isOffline = trafficState.dataSource === "OFFLINE";
  const roadColor = isOffline
    ? "#64748B"
    : trafficState.trafficLevel === "Heavy Traffic"
    ? "#DC2626"
    : trafficState.trafficLevel === "Moderate Traffic"
    ? "#EA580C"
    : "#16A34A";

  // Initialize MapLibre GL JS instance
  useEffect(() => {
    if (!mapContainerRef.current) return;

    try {
      const map = new maplibregl.Map({
        container: mapContainerRef.current,
        style: {
          version: 8,
          sources: {
            "osm-raster-tiles": {
              type: "raster",
              tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
              tileSize: 256,
              attribution: "&copy; OpenStreetMap contributors",
            },
          },
          layers: [
            {
              id: "osm-raster-layer",
              type: "raster",
              source: "osm-raster-tiles",
              minzoom: 0,
              maxzoom: 19,
            },
          ],
        },
        center: MAIN_GATE_COORDS,
        zoom: INITIAL_ZOOM,
        attributionControl: false,
      });

      mapInstanceRef.current = map;

      map.on("load", () => {
        setMapReady(true);

        // 1. Monitored Approach Road Segment (GeoJSON LineString from Solapur Road junction to Main Gate)
        const approachRoadGeoJSON: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { name: "Rajbaug Main Gate Approach Road" },
              geometry: {
                type: "LineString",
                coordinates: [
                  [74.0274, 18.4870], // Pune - Solapur Road (NH 65) junction
                  [74.0271, 18.4883],
                  [74.0268, 18.4897],
                  [74.0264, 18.4908], // Main Gate entrance arch
                  [74.0259, 18.4918], // Campus internal circulation
                ],
              },
            },
          ],
        };

        map.addSource("approach-road", {
          type: "geojson",
          data: approachRoadGeoJSON,
        });

        // Casing / Outline for visual prominence
        map.addLayer({
          id: "approach-road-casing",
          type: "line",
          source: "approach-road",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": "#17172F",
            "line-width": 10,
            "line-opacity": 0.85,
          },
        });

        // Traffic State Colored Segment Layer
        map.addLayer({
          id: "approach-road-traffic",
          type: "line",
          source: "approach-road",
          layout: {
            "line-join": "round",
            "line-cap": "round",
          },
          paint: {
            "line-color": roadColor,
            "line-width": 6,
          },
        });

        // 2. Approximate Sensor Monitoring Zone (Polygon Circle ~25m radius)
        const circleCoords = createGeoJsonCircle(MAIN_GATE_COORDS, 25);
        const sensorZoneGeoJSON: GeoJSON.FeatureCollection = {
          type: "FeatureCollection",
          features: [
            {
              type: "Feature",
              properties: { name: "PIR & Ultrasonic Detection Radius (Approx. 25m)" },
              geometry: {
                type: "Polygon",
                coordinates: [circleCoords],
              },
            },
          ],
        };

        map.addSource("sensor-zone", {
          type: "geojson",
          data: sensorZoneGeoJSON,
        });

        map.addLayer({
          id: "sensor-zone-fill",
          type: "fill",
          source: "sensor-zone",
          paint: {
            "fill-color": "#4B168C",
            "fill-opacity": 0.16,
          },
        });

        map.addLayer({
          id: "sensor-zone-stroke",
          type: "line",
          source: "sensor-zone",
          paint: {
            "line-color": "#D6A52A",
            "line-width": 2,
            "line-dasharray": [3, 2],
          },
        });

        // 3. Main Campus Gate Custom DOM Marker
        const gateMarkerEl = document.createElement("div");
        gateMarkerEl.className = "main-gate-map-pin";
        gateMarkerEl.innerHTML = `
          <div style="display:flex; flex-direction:column; align-items:center; cursor:pointer;">
            <div style="background:#4B168C; color:#FFFFFF; border:2px solid #D6A52A; border-radius:20px; padding:3px 8px; font-size:10.5px; font-weight:800; font-family:'Inter',sans-serif; box-shadow:0 3px 10px rgba(75,22,140,0.4); display:flex; align-items:center; gap:4px; white-space:nowrap;">
              <span>📍</span>
              <span>Main Campus Gate</span>
            </div>
            <div style="width:0; height:0; border-left:5px solid transparent; border-right:5px solid transparent; border-top:6px solid #4B168C; margin-top:-1px;"></div>
          </div>
        `;
        new maplibregl.Marker({ element: gateMarkerEl, anchor: "bottom" })
          .setLngLat(MAIN_GATE_COORDS)
          .addTo(map);

        // 4. Sensor Node Marker
        const sensorMarkerEl = document.createElement("div");
        sensorMarkerEl.innerHTML = `
          <div style="background:#17172F; color:#D6A52A; border:1.5px solid #FFFFFF; border-radius:12px; padding:2px 6px; font-size:9px; font-weight:700; font-family:'Inter',sans-serif; box-shadow:0 2px 6px rgba(0,0,0,0.3); display:flex; align-items:center; gap:3px;">
            <span>📡</span>
            <span>IoT Node (RPi)</span>
          </div>
        `;
        new maplibregl.Marker({ element: sensorMarkerEl, anchor: "top" })
          .setLngLat([74.0263, 18.4909])
          .addTo(map);
      });

      map.on("error", (e) => {
        console.warn("MapLibre event error:", e);
      });

      return () => {
        map.remove();
        mapInstanceRef.current = null;
      };
    } catch (err: any) {
      console.error("MapLibre init error:", err);
      setMapError(err?.message || "Failed to initialize WebGL map.");
    }
  }, []);

  // Sync approach road overlay color whenever traffic state changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !mapReady) return;

    try {
      if (map.getLayer("approach-road-traffic")) {
        map.setPaintProperty("approach-road-traffic", "line-color", roadColor);
      }
    } catch (err) {
      console.warn("Error updating road color layer:", err);
    }
  }, [roadColor, mapReady]);

  // Recenter Handler
  const handleRecenter = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.flyTo({
      center: MAIN_GATE_COORDS,
      zoom: INITIAL_ZOOM,
      essential: true,
      duration: 1000,
    });
  };

  const handleZoomIn = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomIn();
  };

  const handleZoomOut = () => {
    if (!mapInstanceRef.current) return;
    mapInstanceRef.current.zoomOut();
  };

  return (
    <div
      className="flex flex-col h-full relative"
      style={{ background: "#F7F4FB", fontFamily: "'Inter', system-ui, sans-serif" }}
    >
      {/* ── Status Bar / Top Header Overlay ── */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-5 pt-3 pb-2 z-10"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(8px)",
          borderBottom: "1px solid #EADBFA",
        }}
      >
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => navigate("dashboard")}
            aria-label="Back to dashboard"
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all active:scale-90"
            style={{ background: "#F0EAF7", border: "1px solid #EADBFA", cursor: "pointer" }}
          >
            <span style={{ fontSize: "12px", color: "#4B168C" }}>◀</span>
          </button>
          <div>
            <h1 style={{ fontSize: "16px", fontWeight: 800, color: "#17172F", lineHeight: 1.1 }}>
              Live Campus Map
            </h1>
            <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
              MIT-ADT University • Main Gate
            </p>
          </div>
        </div>

        {/* Traffic Level Status Badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1 rounded-full"
          style={{
            background: isOffline ? "#F1F5F9" : roadColor,
            border: isOffline ? "1px solid #CBD5E1" : "none",
            boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#FFFFFF" }}
            aria-hidden="true"
          />
          <span
            style={{
              fontSize: "11px",
              fontWeight: 700,
              color: isOffline ? "#475569" : "#FFFFFF",
              letterSpacing: "0.03em",
            }}
          >
            {isOffline ? "OFFLINE" : trafficState.trafficLevel.toUpperCase()}
          </span>
        </div>
      </div>

      {/* ── Map Canvas Container ── */}
      <div className="flex-1 relative overflow-hidden">
        {mapError ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-slate-50">
            <span style={{ fontSize: "36px", marginBottom: "8px" }}>🗺️</span>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#17172F" }}>
              Map Visualization Error
            </p>
            <p style={{ fontSize: "12px", color: "#64748B", marginTop: "4px" }}>
              {mapError}
            </p>
          </div>
        ) : (
          <div ref={mapContainerRef} className="absolute inset-0 w-full h-full" />
        )}

        {/* ── Map Action Controls (Recenter & Zoom) ── */}
        <div
          className="absolute right-3.5 top-3.5 z-10 flex flex-col gap-1.5"
          style={{ filter: "drop-shadow(0 2px 6px rgba(0,0,0,0.15))" }}
        >
          <button
            type="button"
            onClick={handleRecenter}
            className="w-9 h-9 rounded-xl flex items-center justify-center transition-all active:scale-90"
            style={{ background: "#FFFFFF", border: "1.5px solid #4B168C", cursor: "pointer" }}
            title="Recenter on Main Campus Gate"
            aria-label="Recenter on Main Campus Gate"
          >
            <span style={{ fontSize: "15px" }}>🎯</span>
          </button>
          <button
            type="button"
            onClick={handleZoomIn}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold transition-all active:scale-90"
            style={{ background: "#FFFFFF", border: "1px solid #EADBFA", color: "#17172F", cursor: "pointer" }}
            title="Zoom In"
            aria-label="Zoom In"
          >
            +
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="w-9 h-9 rounded-xl flex items-center justify-center text-base font-bold transition-all active:scale-90"
            style={{ background: "#FFFFFF", border: "1px solid #EADBFA", color: "#17172F", cursor: "pointer" }}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            –
          </button>
        </div>

        {/* ── Compact Traffic Legend Card ── */}
        {showLegend && (
          <div
            className="absolute left-3.5 bottom-3.5 z-10 rounded-2xl p-3 max-w-[280px]"
            style={{
              background: "rgba(255, 255, 255, 0.94)",
              backdropFilter: "blur(8px)",
              border: "1px solid #EADBFA",
              boxShadow: "0 4px 16px rgba(75, 22, 140, 0.12)",
            }}
          >
            <div className="flex items-center justify-between mb-2">
              <span style={{ fontSize: "11px", fontWeight: 800, color: "#17172F", letterSpacing: "0.04em" }}>
                TRAFFIC &amp; SENSOR LEGEND
              </span>
              <button
                type="button"
                onClick={() => setShowLegend(false)}
                className="text-slate-400 hover:text-slate-600 text-[11px] font-bold"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>

            <div className="flex flex-col gap-1.5 text-[10.5px]">
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded" style={{ background: "#16A34A" }} />
                <span style={{ color: "#334155" }}>Low Traffic (Clear Passage)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded" style={{ background: "#EA580C" }} />
                <span style={{ color: "#334155" }}>Moderate Traffic (Minor Delay)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-1.5 rounded" style={{ background: "#DC2626" }} />
                <span style={{ color: "#334155" }}>Heavy Traffic (Congestion at Barrier)</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full border border-dashed border-[#D6A52A] bg-purple-100 flex-shrink-0" />
                <span style={{ color: "#334155" }}>PIR/Ultrasonic Zone (~25m approx.)</span>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-slate-100 text-[9.5px] text-slate-500 leading-tight">
              Approach road segment reflects simulated/telemetry state. Basemap: OpenStreetMap.
            </div>
          </div>
        )}

        {/* Legend Expand Button if collapsed */}
        {!showLegend && (
          <button
            type="button"
            onClick={() => setShowLegend(true)}
            className="absolute left-3.5 bottom-3.5 z-10 px-2.5 py-1.5 rounded-xl text-[10.5px] font-bold flex items-center gap-1"
            style={{
              background: "#FFFFFF",
              border: "1px solid #EADBFA",
              boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
              color: "#4B168C",
              cursor: "pointer",
            }}
          >
            <span>ℹ️</span>
            <span>Show Legend</span>
          </button>
        )}

        {/* Attribution Badge */}
        <div
          className="absolute right-2 bottom-1 z-10 px-1.5 py-0.5 rounded text-[8.5px] font-medium"
          style={{ background: "rgba(255,255,255,0.75)", color: "#64748B" }}
        >
          © OpenStreetMap contributors
        </div>
      </div>

      {/* ── 5 Main Navigation Destinations ── */}
      <div
        className="flex-shrink-0 z-10"
        style={{
          background: "#FFFFFF",
          borderTop: "1px solid #EADBFA",
          boxShadow: "0 -4px 16px rgba(75,22,140,0.05)",
        }}
      >
        <nav aria-label="Main navigation">
          <div className="flex">
            {navTabs.map((tab) => {
              const isActive = tab.id === "live-map";
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
                      fontSize: "10px",
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

```

---

### SECTION 4.05: IOT EDGE DIAGNOSTICS & ACADEMIC SIMULATOR SCREEN
**Target Path:** `src/app/components/screens/SensorsSettingsScreen.tsx`  
**Language:** `tsx` | **Line Count:** `636`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx
import { Screen, TrafficState, SensorTelemetry, NotificationSettings } from "../../types";

interface SensorsSettingsScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
  sensorTelemetry: SensorTelemetry;
  notificationSettings: NotificationSettings;
  onUpdateNotifications: (settings: Partial<NotificationSettings>) => void;
  onSimulateState: (preset: "heavy" | "moderate" | "normal" | "offline" | "aws-error") => void;
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

function SystemIcon({ active }: { active: boolean }) {
  const c = active ? "#4B168C" : "#94A3B8";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="3" stroke={c} strokeWidth="1.8" fill={active ? "rgba(75, 22, 140, 0.12)" : "none"} />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke={c}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
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
    { id: "sensors-settings", label: "System", icon: (a) => <SystemIcon active={a} /> },
  ];

  const isPirOnline = sensorTelemetry.pirStatus === "online";
  const isUltraOnline = sensorTelemetry.ultrasonicStatus === "online";
  const isRpiOnline = sensorTelemetry.rpiNodeStatus === "online";
  const isAwsConnected = sensorTelemetry.awsIotStatus === "connected";

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#F7F4FB", fontFamily: "'Inter', system-ui, sans-serif" }}
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
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all active:scale-90"
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
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
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
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
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
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
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
                <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center">
                  <span style={{ fontSize: "14px" }}>☁️</span>
                </div>
                <div>
                  <p style={{ fontSize: "13px", fontWeight: 700, color: "#17172F" }}>
                    AWS IoT Core (MQTT)
                  </p>
                  <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                    Topic: {sensorTelemetry.awsTopic} ({sensorTelemetry.awsRegion})
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
                <div className="w-8 h-8 rounded-lg bg-amber-50 flex items-center justify-center">
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
              const isActive = tab.id === "sensors-settings";
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
                      fontSize: "10px",
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

```

---

### SECTION 4.06: HOURLY TELEMETRY TRENDS & RECHARTS ANALYTICS SCREEN
**Target Path:** `src/app/components/screens/AnalyticsScreen.tsx`  
**Language:** `tsx` | **Line Count:** `376`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx
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
import { Screen, TrafficState } from "../../types";

interface AnalyticsScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
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

function SystemIcon({ active }: { active: boolean }) {
  const c = active ? "#4B168C" : "#94A3B8";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="3" stroke={c} strokeWidth="1.8" fill={active ? "rgba(75, 22, 140, 0.12)" : "none"} />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke={c}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// Hourly Simulated Sensor Data Pattern for MIT-ADT Main Campus Gate (Prototype Demo)
const SIMULATED_HOURLY_DATA = [
  { time: "8 AM", triggers: 14, distance: "5.2 m", status: "Low" },
  { time: "9 AM", triggers: 38, distance: "1.1 m", status: "Heavy" },
  { time: "11 AM", triggers: 10, distance: "6.8 m", status: "Low" },
  { time: "1 PM", triggers: 20, distance: "3.4 m", status: "Moderate" },
  { time: "3 PM", triggers: 18, distance: "3.9 m", status: "Moderate" },
  { time: "4:30 PM", triggers: 35, distance: "1.4 m", status: "Heavy" },
  { time: "5:30 PM", triggers: 42, distance: "0.9 m", status: "Heavy" },
  { time: "6:30 PM", triggers: 16, distance: "4.5 m", status: "Moderate" },
];

function getBarColor(status: string) {
  if (status === "Low") return "#16A34A";
  if (status === "Moderate") return "#EA580C";
  return "#DC2626";
}

export function AnalyticsScreen({ navigate }: AnalyticsScreenProps) {
  const [activeMetric, setActiveMetric] = useState<"triggers" | "distance">("triggers");

  const navTabs: NavTab[] = [
    { id: "dashboard", label: "Home", icon: (a) => <HomeIcon active={a} /> },
    { id: "live-map", label: "Live Map", icon: (a) => <MapIcon active={a} /> },
    { id: "alerts", label: "Alerts", icon: (a) => <BellIcon active={a} /> },
    { id: "analytics", label: "Analytics", icon: (a) => <ChartIcon active={a} /> },
    { id: "sensors-settings", label: "System", icon: (a) => <SystemIcon active={a} /> },
  ];

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#F7F4FB", fontFamily: "'Inter', system-ui, sans-serif" }}
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
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all active:scale-90"
            style={{ background: "#F0EAF7", border: "1px solid #EADBFA", cursor: "pointer" }}
          >
            <span style={{ fontSize: "12px", color: "#4B168C" }}>◀</span>
          </button>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#17172F", lineHeight: 1.1 }}>
              Traffic &amp; Sensor Analytics
            </h1>
            <p style={{ fontSize: "11px", color: "#6B6B80" }}>
              Main Campus Gate • Shift Trends
            </p>
          </div>
        </div>

        <span
          className="px-2 py-0.5 rounded text-[10px] font-bold"
          style={{ background: "#FEF3C7", color: "#B45309", border: "1px solid #FDE68A" }}
        >
          SIMULATED DATA
        </span>
      </div>

      {/* ── Metric View Selector ── */}
      <div className="flex-shrink-0 px-5 py-2.5 flex items-center gap-2" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0EAF7" }}>
        <button
          type="button"
          onClick={() => setActiveMetric("triggers")}
          className="px-3 py-1 rounded-full text-[11px] font-bold transition-all"
          style={{
            background: activeMetric === "triggers" ? "#4B168C" : "#F7F4FB",
            color: activeMetric === "triggers" ? "#FFFFFF" : "#6B6B80",
            border: activeMetric === "triggers" ? "1.5px solid #4B168C" : "1px solid #EADBFA",
            cursor: "pointer",
          }}
        >
          ⚡ PIR Motion Frequency (Triggers/min)
        </button>
        <button
          type="button"
          onClick={() => setActiveMetric("distance")}
          className="px-3 py-1 rounded-full text-[11px] font-bold transition-all"
          style={{
            background: activeMetric === "distance" ? "#4B168C" : "#F7F4FB",
            color: activeMetric === "distance" ? "#FFFFFF" : "#6B6B80",
            border: activeMetric === "distance" ? "1.5px solid #4B168C" : "1px solid #EADBFA",
            cursor: "pointer",
          }}
        >
          📡 Ultrasonic Queue Distance
        </button>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4" style={{ scrollbarWidth: "none" }}>

        {/* ── Disclaimer Banner ── */}
        <div
          className="rounded-xl p-2.5 mb-3 flex items-start gap-2"
          style={{ background: "#F0EAF7", border: "1px solid #EADBFA" }}
        >
          <span style={{ fontSize: "13px" }}>ℹ️</span>
          <p style={{ fontSize: "10.5px", color: "#4B168C", lineHeight: 1.4 }}>
            <strong>Academic Prototype Analytics:</strong> Charts illustrate projected sensor throughput profiles. Continuous cloud analytics will persist into Amazon DynamoDB once the physical edge hardware is deployed.
          </p>
        </div>

        {/* ── Primary Chart Card ── */}
        <div
          className="rounded-2xl p-4 mb-3.5"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #EADBFA",
            boxShadow: "0 2px 8px rgba(75, 22, 140, 0.05)",
          }}
        >
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 style={{ fontSize: "13.5px", fontWeight: 700, color: "#17172F" }}>
                {activeMetric === "triggers" ? "Hourly Motion Activity (PIR Sensor)" : "Distance to Barrier (HC-SR04 Sensor)"}
              </h3>
              <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                Main Campus Gate • Shift Distribution
              </p>
            </div>
            <span
              className="px-2 py-0.5 rounded text-[10px] font-bold"
              style={{ background: "#F7F4FB", color: "#4B168C" }}
            >
              Demo Profile
            </span>
          </div>

          <div style={{ width: "100%", height: 180 }}>
            {activeMetric === "triggers" ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={SIMULATED_HOURLY_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#6B6B80" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#6B6B80" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`${val} triggers/min`, "Motion Rate"]}
                    contentStyle={{ background: "#17172F", border: "none", borderRadius: "8px", color: "#FFFFFF", fontSize: "11px" }}
                  />
                  <Bar dataKey="triggers" radius={[4, 4, 0, 0]}>
                    {SIMULATED_HOURLY_DATA.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={getBarColor(entry.status)} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={SIMULATED_HOURLY_DATA.map((d) => ({
                    time: d.time,
                    distNum: parseFloat(d.distance),
                  }))}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" vertical={false} />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: "#6B6B80" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 10, fill: "#6B6B80" }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(val: any) => [`${val} m`, "Distance to Barrier"]}
                    contentStyle={{ background: "#17172F", border: "none", borderRadius: "8px", color: "#FFFFFF", fontSize: "11px" }}
                  />
                  <Line type="monotone" dataKey="distNum" stroke="#4B168C" strokeWidth={2.5} dot={{ fill: "#D6A52A", r: 4 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="flex items-center justify-around mt-3 pt-2.5 border-t border-slate-100 text-[10px] text-slate-500">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#16A34A" }} />
              <span>Low (&lt;15)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#EA580C" }} />
              <span>Moderate (15-30)</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ background: "#DC2626" }} />
              <span>Heavy (&gt;30)</span>
            </div>
          </div>
        </div>

        {/* ── Key Shift Observations ── */}
        <div
          className="rounded-2xl p-3.5"
          style={{ background: "#FFFFFF", border: "1px solid #EADBFA" }}
        >
          <h4 style={{ fontSize: "12px", fontWeight: 700, color: "#17172F", marginBottom: "6px" }}>
            Estimated Campus Rush Intervals
          </h4>
          <div className="flex flex-col gap-2 text-[11px] text-slate-600">
            <div className="flex items-start gap-2">
              <span className="text-amber-600 font-bold">● Morning Entry (8:45 – 9:30 AM):</span>
              <span>High PIR pulse trigger rates as faculty and students arrive simultaneously.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-red-600 font-bold">● Evening Departure (4:30 – 5:45 PM):</span>
              <span>Barrier queue increases; HC-SR04 detects vehicles stationed closer to sensor node.</span>
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
              const isActive = tab.id === "analytics";
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
                      fontSize: "10px",
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

```

---

### SECTION 4.07: REAL-TIME INCIDENT & CONGESTION ALERT FEED SCREEN
**Target Path:** `src/app/components/screens/AlertsScreen.tsx`  
**Language:** `tsx` | **Line Count:** `359`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx
import { useState } from "react";
import { Screen, TrafficState, SensorTelemetry } from "../../types";

interface AlertsScreenProps {
  navigate: (screen: Screen) => void;
  trafficState: TrafficState;
  sensorTelemetry: SensorTelemetry;
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

function SystemIcon({ active }: { active: boolean }) {
  const c = active ? "#4B168C" : "#94A3B8";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="3" stroke={c} strokeWidth="1.8" fill={active ? "rgba(75, 22, 140, 0.12)" : "none"} />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke={c}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function AlertsScreen({ navigate, trafficState, sensorTelemetry }: AlertsScreenProps) {
  const [filter, setFilter] = useState<"all" | "traffic" | "system">("all");

  const navTabs: NavTab[] = [
    { id: "dashboard", label: "Home", icon: (a) => <HomeIcon active={a} /> },
    { id: "live-map", label: "Live Map", icon: (a) => <MapIcon active={a} /> },
    { id: "alerts", label: "Alerts", icon: (a) => <BellIcon active={a} /> },
    { id: "analytics", label: "Analytics", icon: (a) => <ChartIcon active={a} /> },
    { id: "sensors-settings", label: "System", icon: (a) => <SystemIcon active={a} /> },
  ];

  const isHeavy = trafficState.trafficLevel === "Heavy Traffic";
  const isOffline = trafficState.dataSource === "OFFLINE";
  const isAwsDisconnected = sensorTelemetry.awsIotStatus === "disconnected";

  // Dynamic alerts list reflecting active traffic and sensor simulator state
  const alertsList = [
    ...(isHeavy
      ? [
          {
            id: "heavy-alert",
            type: "traffic",
            severity: "critical",
            title: "Heavy Traffic at Main Campus Gate",
            body: "Sensor motion activity indicates high queue congestion near the barrier arm. Delays expected heading towards Pune-Solapur Highway.",
            time: "Simulated: Active Now",
            tag: "SIMULATED",
          },
        ]
      : []),
    ...(isOffline
      ? [
          {
            id: "offline-alert",
            type: "system",
            severity: "critical",
            title: "Sensor Edge Node Offline",
            body: "Raspberry Pi edge node telemetry is offline. Gate queue estimates are suspended until connection is restored.",
            time: "Simulated: Active Now",
            tag: "SIMULATED",
          },
        ]
      : []),
    ...(isAwsDisconnected
      ? [
          {
            id: "aws-alert",
            type: "system",
            severity: "warning",
            title: "AWS IoT Core Telemetry Disconnected",
            body: "MQTT broker connection to ap-south-1 failed. Telemetry payload ingestion is retrying.",
            time: "Simulated: Active Now",
            tag: "SIMULATED",
          },
        ]
      : []),
    {
      id: "normal-flow",
      type: "traffic",
      severity: "info",
      title: "Main Gate Telemetry Monitoring Active",
      body: "PIR motion sensor and HC-SR04 ultrasonic distance telemetry are feeding real-time updates.",
      time: "Simulated: Today, 8:00 AM",
      tag: "SIMULATED",
    },
    {
      id: "academic-scope",
      type: "system",
      severity: "info",
      title: "Single Gate Deployment Notice",
      body: "Phase 1 scope monitors the Main Campus Gate at Rajbaug Campus. North, South, and Hostel gates are queued for future expansion.",
      time: "Campus Admin",
      tag: "SYSTEM NOTICE",
    },
  ];

  const filteredAlerts = alertsList.filter((a) => {
    if (filter === "all") return true;
    return a.type === filter;
  });

  return (
    <div
      className="flex flex-col h-full"
      style={{ background: "#F7F4FB", fontFamily: "'Inter', system-ui, sans-serif" }}
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
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all active:scale-90"
            style={{ background: "#F0EAF7", border: "1px solid #EADBFA", cursor: "pointer" }}
          >
            <span style={{ fontSize: "12px", color: "#4B168C" }}>◀</span>
          </button>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#17172F", lineHeight: 1.1 }}>
              Alerts &amp; Incidents
            </h1>
            <p style={{ fontSize: "11px", color: "#6B6B80" }}>
              Main Campus Gate • Notification Log
            </p>
          </div>
        </div>

        <span
          className="px-2 py-0.5 rounded text-[10px] font-bold"
          style={{ background: "#F0EAF7", color: "#4B168C" }}
        >
          {filteredAlerts.length} Alerts
        </span>
      </div>

      {/* ── Filter Pills ── */}
      <div className="flex-shrink-0 px-5 py-2.5 flex items-center gap-2" style={{ background: "#FFFFFF", borderBottom: "1px solid #F0EAF7" }}>
        {(["all", "traffic", "system"] as const).map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className="px-3 py-1 rounded-full text-[11px] font-bold transition-all"
            style={{
              background: filter === f ? "#4B168C" : "#F7F4FB",
              color: filter === f ? "#FFFFFF" : "#6B6B80",
              border: filter === f ? "1.5px solid #4B168C" : "1px solid #EADBFA",
              cursor: "pointer",
            }}
          >
            {f === "all" ? "All Alerts" : f === "traffic" ? "Traffic Events" : "System / Hardware"}
          </button>
        ))}
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-3 pb-4" style={{ scrollbarWidth: "none" }}>

        {/* ── AWS SNS Advisory Banner ── */}
        <div
          className="rounded-xl p-2.5 mb-3 flex items-start gap-2"
          style={{ background: "#F0EAF7", border: "1px solid #EADBFA" }}
        >
          <span style={{ fontSize: "13px" }}>ℹ️</span>
          <p style={{ fontSize: "10.5px", color: "#4B168C", lineHeight: 1.4 }}>
            <strong>In-App Alert Prototype:</strong> External SMS/Push delivery (AWS SNS) is unconfigured in this prototype. Events trigger in-app alerts based on simulated telemetry.
          </p>
        </div>

        {/* ── Alerts Feed ── */}
        <div className="flex flex-col gap-2.5">
          {filteredAlerts.map((alert) => {
            const isCrit = alert.severity === "critical";
            const isWarn = alert.severity === "warning";
            const borderColor = isCrit ? "#FCA5A5" : isWarn ? "#FED7AA" : "#EADBFA";
            const badgeBg = isCrit ? "#FEE2E2" : isWarn ? "#FFEDD5" : "#F0EAF7";
            const badgeColor = isCrit ? "#B91C1C" : isWarn ? "#C2410C" : "#4B168C";

            return (
              <div
                key={alert.id}
                className="rounded-2xl p-3.5 flex flex-col gap-1.5"
                style={{
                  background: "#FFFFFF",
                  border: `1.5px solid ${borderColor}`,
                  boxShadow: "0 1px 4px rgba(0,0,0,0.03)",
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span style={{ fontSize: "14px" }}>
                      {isCrit ? "🔴" : isWarn ? "🟠" : "🔵"}
                    </span>
                    <h3 style={{ fontSize: "13px", fontWeight: 700, color: "#17172F" }}>
                      {alert.title}
                    </h3>
                  </div>
                  <span
                    className="px-1.5 py-0.5 rounded text-[9px] font-bold"
                    style={{ background: badgeBg, color: badgeColor }}
                  >
                    {alert.tag}
                  </span>
                </div>

                <p style={{ fontSize: "11.5px", color: "#4B5563", lineHeight: 1.4 }}>
                  {alert.body}
                </p>

                <div className="flex items-center justify-between text-[10px] text-slate-400 mt-1 pt-1.5 border-t border-slate-50">
                  <span>{alert.time}</span>
                  <button
                    type="button"
                    onClick={() => navigate(alert.type === "traffic" ? "live-map" : "sensors-settings")}
                    style={{ color: "#4B168C", fontWeight: 600, background: "none", border: "none", cursor: "pointer" }}
                  >
                    {alert.type === "traffic" ? "View on Map →" : "Diagnostics →"}
                  </button>
                </div>
              </div>
            );
          })}
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
              const isActive = tab.id === "alerts";
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
                      fontSize: "10px",
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

```

---

### SECTION 4.08: GATE SHIFT METRICS & QUEUE DIAGNOSTICS SCREEN
**Target Path:** `src/app/components/screens/GateTrafficDetailsScreen.tsx`  
**Language:** `tsx` | **Line Count:** `205`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx
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

  const statusColor = isOffline ? "#64748B" : isHeavy ? "#DC2626" : isModerate ? "#EA580C" : "#16A34A";

  const timelineNodes: TimelineNode[] = [
    { time: "4:00 PM", status: "Low", color: "#16A34A" },
    { time: "4:45 PM", status: "Moderate", color: "#EA580C" },
    { time: "5:30 PM", status: isHeavy ? "Heavy" : "Moderate", color: statusColor },
  ];

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: "'Inter', system-ui",
        background: "#F7F4FB",
        display: "flex",
        flexDirection: "column",
      }}
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
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all active:scale-90"
            style={{ background: "#F0EAF7", border: "1px solid #EADBFA", cursor: "pointer" }}
          >
            <span style={{ fontSize: "12px", color: "#4B168C" }}>◀</span>
          </button>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#17172F", lineHeight: 1.1 }}>
              Gate Shift Metrics
            </h1>
            <p style={{ fontSize: "11px", color: "#6B6B80" }}>
              Main Campus Gate • Telemetry Breakdown
            </p>
          </div>
        </div>

        <span
          className="px-2 py-0.5 rounded text-[10px] font-bold"
          style={{ background: "#F0EAF7", color: "#4B168C", border: "1px solid #EADBFA" }}
        >
          {trafficState.dataSource}
        </span>
      </div>

      {/* ── Scrollable Body ── */}
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px 20px" }}>

        {/* Gate Title Card */}
        <div
          className="rounded-2xl p-4 mb-3 flex items-center justify-between"
          style={{
            background: "#FFFFFF",
            border: "1.5px solid #EADBFA",
            boxShadow: "0 2px 8px rgba(75, 22, 140, 0.04)",
          }}
        >
          <div>
            <div className="flex items-center gap-1.5">
              <span style={{ fontSize: "16px" }}>📍</span>
              <h2 style={{ fontSize: "15px", fontWeight: 800, color: "#17172F" }}>
                Main Campus Gate
              </h2>
            </div>
            <p style={{ fontSize: "11px", color: "#6B6B80", marginTop: "2px" }}>
              Rajbaug Campus to Pune-Solapur Highway (NH 65)
            </p>
          </div>
          <span
            className="px-2.5 py-1 rounded-full text-[11px] font-bold text-white"
            style={{ background: statusColor }}
          >
            {isOffline ? "OFFLINE" : trafficState.trafficLevel}
          </span>
        </div>

        {/* Telemetry Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-2.5 mb-3.5">
          {/* Motion Activity */}
          <div className="rounded-2xl p-3 bg-white border border-[#EADBFA]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              PIR MOTION LEVEL
            </span>
            <div className="text-base font-extrabold text-[#17172F]">
              {trafficState.motionActivity}
            </div>
            <span className="text-[10px] text-slate-400">
              {sensorTelemetry.pirTriggersPerMin} triggers/min
            </span>
          </div>

          {/* Ultrasonic Distance */}
          <div className="rounded-2xl p-3 bg-white border border-[#EADBFA]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              BARRIER DISTANCE
            </span>
            <div className="text-base font-extrabold text-[#17172F]">
              {trafficState.measuredDistance}
            </div>
            <span className="text-[10px] text-slate-400">
              HC-SR04 obstacle depth
            </span>
          </div>

          {/* Estimated Exit Delay */}
          <div className="rounded-2xl p-3 bg-white border border-[#EADBFA]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              ESTIMATED DELAY
            </span>
            <div className="text-base font-extrabold text-[#17172F]">
              {trafficState.estimatedDelay}
            </div>
            <span className="text-[10px] text-slate-400">
              Prototype estimate
            </span>
          </div>

          {/* RPi Edge Node State */}
          <div className="rounded-2xl p-3 bg-white border border-[#EADBFA]">
            <span className="text-[10px] font-bold text-slate-500 uppercase block mb-1">
              EDGE NODE STATE
            </span>
            <div className="text-base font-extrabold text-[#17172F]">
              {sensorTelemetry.rpiNodeStatus === "online" ? "Online" : "Offline"}
            </div>
            <span className="text-[10px] text-slate-400">
              RPi 4 (ap-south-1)
            </span>
          </div>
        </div>

        {/* Recent Shift Trend Timeline */}
        <div
          className="rounded-2xl p-4 mb-3.5 bg-white border border-[#EADBFA]"
          style={{ boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
        >
          <h3 className="text-[12.5px] font-bold text-[#17172F] mb-3">
            Recent Hourly Shift Trend (Simulated)
          </h3>
          <div className="flex justify-between items-center px-2">
            {timelineNodes.map((node) => (
              <div key={node.time} className="flex flex-col items-center gap-1">
                <span className="text-[11px] font-bold" style={{ color: node.color }}>
                  {node.status}
                </span>
                <div
                  className="w-4 h-4 rounded-full flex items-center justify-center text-white"
                  style={{ background: node.color }}
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-white" />
                </div>
                <span className="text-[10px] text-slate-500 font-semibold">{node.time}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <button
          type="button"
          onClick={() => navigate("live-map")}
          className="w-full py-3 rounded-2xl text-[13.5px] font-bold text-white transition-all"
          style={{
            background: "linear-gradient(135deg, #4B168C 0%, #3B1170 100%)",
            border: "1.5px solid #D6A52A",
            cursor: "pointer",
          }}
        >
          View Main Gate On Live Map
        </button>

      </div>
    </div>
  );
}

```

---

### SECTION 4.09: ACADEMIC DEMO LOGIN & AUTHENTICATION SCREEN
**Target Path:** `src/app/components/screens/LoginScreen.tsx`  
**Language:** `tsx` | **Line Count:** `344`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx
import { useState, useId } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { Screen } from "../../types";

interface LoginScreenProps {
  navigate: (screen: Screen) => void;
  onGuestLogin?: () => void;
}

function TraffiQAppIcon() {
  return (
    <div
      className="flex items-center justify-center mb-2"
      style={{
        width: "56px",
        height: "56px",
        borderRadius: "18px",
        background: "linear-gradient(145deg, #1C0C3A 0%, #290E52 100%)",
        border: "1.5px solid rgba(214, 165, 42, 0.75)",
        boxShadow: "0 8px 22px rgba(41, 14, 82, 0.35)",
      }}
      aria-hidden="true"
    >
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        {/* Sensor radio wave arc at top-left */}
        <path
          d="M8.5 9.5C9.8 8.2 11.6 7.4 13.5 7.4"
          stroke="#D6A52A"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
        <circle cx="8.5" cy="12.5" r="1.3" fill="#D6A52A" />

        {/* Outer Campus Gate Arch */}
        <path
          d="M9.5 24V14C9.5 10.96 11.96 8.5 15 8.5C18.04 8.5 20.5 10.96 20.5 14V24"
          stroke="#FFFFFF"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Inner Gold Arch */}
        <path
          d="M12.5 24V16C12.5 14.62 13.62 13.5 15 13.5C16.38 13.5 17.5 14.62 17.5 16V24"
          stroke="#D6A52A"
          strokeWidth="1.8"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function Spinner() {
  return (
    <svg className="animate-spin" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
      <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
      <path d="M9 2a7 7 0 017 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function LoginScreen({ navigate, onGuestLogin }: LoginScreenProps) {
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEnterDashboard = () => {
    if (onGuestLogin) {
      onGuestLogin();
    } else {
      navigate("dashboard");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      handleEnterDashboard();
    }, 400);
  };

  return (
    <div
      className="relative flex flex-col h-full w-full overflow-y-auto"
      style={{
        background: "linear-gradient(180deg, #240C44 0%, #15062C 100%)",
        scrollbarWidth: "none",
      }}
    >
      {/* ── Top MIT-ADT Dome Photography Banner ── */}
      <div className="relative w-full h-[240px] flex-shrink-0 overflow-hidden">
        <img
          src="/mit_adt_dome.png"
          alt="MIT-ADT University World Peace Dome, Rajbaug Campus, Pune"
          className="w-full h-full object-cover object-top"
        />
        {/* Soft gradient blend at bottom of dome photo */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(23,23,47,0) 0%, rgba(23,23,47,0.15) 55%, rgba(20,5,44,0.7) 100%)",
          }}
        />
      </div>

      {/* ── Centered Floating White Card (Exact Layout of Reference Design) ── */}
      <div className="px-3.5 -mt-8 pb-5 flex-1 flex flex-col">
        <div
          className="bg-white rounded-[32px] px-5 pt-4 pb-5 flex flex-col"
          style={{
            boxShadow: "0 20px 48px rgba(15, 5, 30, 0.45)",
            border: "1px solid rgba(234, 219, 250, 0.95)",
          }}
        >
          {/* Logo & University Title */}
          <div className="flex flex-col items-center text-center mb-3">
            <TraffiQAppIcon />

            <div className="flex items-baseline justify-center gap-0.5" aria-label="TRAFFIQ">
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                  color: "#17172F",
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              >
                TRAFF
              </span>
              <span
                style={{
                  fontSize: "26px",
                  fontWeight: 900,
                  letterSpacing: "-0.5px",
                  color: "#4B168C",
                  fontFamily: "'Inter', system-ui, sans-serif",
                }}
              >
                IQ
              </span>
            </div>

            <p
              style={{
                fontSize: "11px",
                color: "#4B168C",
                letterSpacing: "0.06em",
                fontWeight: 800,
                textTransform: "uppercase",
                marginTop: "2px",
              }}
            >
              MIT-ADT UNIVERSITY • PUNE
            </p>
            <p
              style={{
                fontSize: "10.5px",
                color: "#6B6B80",
                fontWeight: 500,
                marginTop: "1px",
              }}
            >
              Rajbaug Campus • Main Gate IoT Monitor
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-3">
            {/* EMAIL */}
            <div>
              <label
                htmlFor={emailId}
                style={{
                  fontSize: "10.5px",
                  fontWeight: 800,
                  color: "#17172F",
                  display: "block",
                  marginBottom: "4px",
                  letterSpacing: "0.03em",
                }}
              >
                EMAIL
              </label>
              <div
                className="flex items-center w-full h-[44px] rounded-xl px-3 transition-all"
                style={{
                  background: "#F7F4FB",
                  border: "1.5px solid #EADBFA",
                }}
              >
                <Mail size={16} className="text-[#6B6B80] flex-shrink-0 mr-2.5" />
                <input
                  id={emailId}
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. user@mituniversity.edu.in"
                  className="w-full bg-transparent outline-none text-[13px]"
                  style={{
                    color: "#17172F",
                    fontFamily: "'Inter', system-ui",
                  }}
                />
              </div>
            </div>

            {/* PASSWORD */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor={passwordId}
                  style={{
                    fontSize: "10.5px",
                    fontWeight: 800,
                    color: "#17172F",
                    letterSpacing: "0.03em",
                  }}
                >
                  PASSWORD
                </label>
                <button
                  type="button"
                  onClick={() => navigate("forgot-password")}
                  style={{
                    fontSize: "11px",
                    color: "#4B168C",
                    fontWeight: 700,
                    background: "none",
                    border: "none",
                    cursor: "pointer",
                  }}
                >
                  Forgot?
                </button>
              </div>

              <div
                className="flex items-center w-full h-[44px] rounded-xl px-3 transition-all"
                style={{
                  background: "#F7F4FB",
                  border: "1.5px solid #EADBFA",
                }}
              >
                <Lock size={16} className="text-[#6B6B80] flex-shrink-0 mr-2.5" />
                <input
                  id={passwordId}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  className="w-full bg-transparent outline-none text-[13px]"
                  style={{
                    color: "#17172F",
                    fontFamily: "'Inter', system-ui",
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-[#6B6B80] hover:text-[#17172F] p-1 flex-shrink-0"
                  style={{ background: "none", border: "none", cursor: "pointer" }}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <Eye size={16} /> : <EyeOff size={16} />}
                </button>
              </div>
            </div>

            {/* Sign Up Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98] mt-0.5"
              style={{
                height: "46px",
                borderRadius: "14px",
                background: "linear-gradient(135deg, #370E68 0%, #200540 100%)",
                boxShadow: "0 6px 18px rgba(45, 12, 85, 0.35)",
                border: "none",
                color: "#FFFFFF",
                fontSize: "14px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <span>Sign Up</span>
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-3.5">
            <div className="flex-1 h-px" style={{ background: "#EADBFA" }} />
            <span style={{ fontSize: "10.5px", color: "#8E8EA0", fontWeight: 700, letterSpacing: "0.05em" }}>
              OR
            </span>
            <div className="flex-1 h-px" style={{ background: "#EADBFA" }} />
          </div>

          {/* Continue as Guest Button */}
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={handleEnterDashboard}
              className="w-full flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
              style={{
                height: "44px",
                borderRadius: "14px",
                background: "#FFFFFF",
                border: "1.5px solid #4B168C",
                color: "#4B168C",
                cursor: "pointer",
              }}
              aria-label="Continue as Guest to Main Campus Gate Dashboard"
            >
              <User size={16} className="text-[#4B168C]" />
              <span style={{ fontSize: "13.5px", fontWeight: 700 }}>
                Continue as Guest
              </span>
            </button>
            <p style={{ fontSize: "10px", color: "#6B6B80", textAlign: "center", lineHeight: 1.35, marginTop: "1px" }}>
              No credentials required. Opens the Main Campus Gate dashboard directly.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

```

---

### SECTION 4.10: SELF-SERVICE PASSWORD RECOVERY SCREEN
**Target Path:** `src/app/components/screens/ForgotPasswordScreen.tsx`  
**Language:** `tsx` | **Line Count:** `239`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx
import { useState, useId } from "react";
import { Screen } from "../../types";

interface ForgotPasswordScreenProps {
  navigate: (screen: Screen) => void;
}

type Step = "input" | "sending" | "sent";

export function ForgotPasswordScreen({ navigate }: ForgotPasswordScreenProps) {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [focused, setFocused] = useState(false);
  const [step, setStep] = useState<Step>("input");
  const [error, setError] = useState("");

  const isValid = email.includes("@") || /^\d{6,}$/.test(email.trim()) || email.toUpperCase().startsWith("MIT");

  const handleSend = () => {
    if (!email.trim()) {
      setError("Please enter your university email or student ID.");
      return;
    }
    if (!isValid) {
      setError("Enter a valid university email or student ID.");
      return;
    }
    setError("");
    setStep("sending");
    setTimeout(() => setStep("sent"), 1000);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    height: "54px",
    borderRadius: "16px",
    paddingLeft: "16px",
    paddingRight: "16px",
    outline: "none",
    fontSize: "15px",
    fontFamily: "'Inter', system-ui, sans-serif",
    color: "#0d1b3e",
    background: focused ? "#ffffff" : "#f8fafc",
    border: `1.5px solid ${error ? "#ef4444" : focused ? "#4B168C" : "#EADBFA"}`,
    boxShadow: error
      ? "0 0 0 3px rgba(239,68,68,0.10)"
      : focused
      ? "0 0 0 3px rgba(75,22,140,0.12)"
      : "none",
    transition: "all 0.2s",
  };

  return (
    <div className="flex flex-col h-full" style={{ background: "#ffffff" }}>
      {/* Status bar */}
      <div
        className="flex-shrink-0 flex items-center justify-between px-6 pt-3 pb-1"
        aria-hidden="true"
        style={{ height: "44px" }}
      >
        <span style={{ fontSize: "15px", fontWeight: 600, color: "#17172F", fontFamily: "'Inter', system-ui" }}>MIT-ADT</span>
        <div className="flex items-center gap-1.5">
          <span className="px-2 py-0.5 rounded text-[10px] font-bold" style={{ background: "#F0EAF7", color: "#4B168C" }}>
            PASSWORD RESET
          </span>
        </div>
      </div>

      {/* Back button */}
      <div className="flex-shrink-0 px-5 pt-3 pb-2">
        <button
          onClick={() => navigate("login")}
          aria-label="Back to login"
          className="flex items-center gap-1.5 -ml-1"
          style={{ background: "none", border: "none", cursor: "pointer", padding: "6px 8px", borderRadius: "10px" }}
        >
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
            <path d="M12.5 5l-5 5 5 5" stroke="#4B168C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span style={{ fontSize: "14px", color: "#4B168C", fontWeight: 600 }}>Back to Log in</span>
        </button>
      </div>

      {/* Body */}
      <div className="flex-1 px-6 pt-4 overflow-y-auto" style={{ scrollbarWidth: "none" }}>
        {step !== "sent" ? (
          <div>
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
              style={{ background: "#F0EAF7", border: "1.5px solid #EADBFA" }}
              aria-hidden="true"
            >
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect x="3" y="6" width="22" height="16" rx="3" stroke="#4B168C" strokeWidth="2" />
                <path d="M3 10l11 7 11-7" stroke="#4B168C" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>

            <h1
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#17172F",
                lineHeight: 1.25,
                marginBottom: "8px",
                fontFamily: "'Inter', system-ui",
              }}
            >
              Reset your password
            </h1>
            <p style={{ fontSize: "14px", color: "#6B6B80", lineHeight: 1.5, marginBottom: "28px" }}>
              Enter your registered MIT-ADT university email address or campus ID. We&apos;ll send you a password reset OTP code.
            </p>

            <div className="mb-6">
              <label
                htmlFor={emailId}
                style={{ fontSize: "11px", fontWeight: 700, color: "#17172F", letterSpacing: "0.05em", display: "block", marginBottom: "6px" }}
              >
                UNIVERSITY EMAIL OR CAMPUS ID
              </label>
              <input
                id={emailId}
                type="text"
                value={email}
                placeholder="e.g. operator@mituniversity.edu.in"
                style={inputStyle}
                autoComplete="email"
                aria-invalid={!!error}
                onFocus={() => {
                  setFocused(true);
                  if (error) setError("");
                }}
                onBlur={() => setFocused(false)}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError("");
                }}
              />
              {error && (
                <p role="alert" className="flex items-center gap-1.5 mt-2" style={{ fontSize: "12px", color: "#dc2626" }}>
                  <svg width="13" height="13" viewBox="0 0 13 13" fill="#dc2626" aria-hidden="true">
                    <circle cx="6.5" cy="6.5" r="6" />
                    <path d="M6.5 4v3.5M6.5 9v.5" stroke="white" strokeWidth="1.4" strokeLinecap="round" />
                  </svg>
                  {error}
                </p>
              )}
            </div>

            <button
              type="button"
              onClick={handleSend}
              disabled={step === "sending"}
              aria-label={step === "sending" ? "Sending link…" : "Send reset link"}
              className="w-full flex items-center justify-center gap-2 transition-all duration-200 active:scale-[0.98]"
              style={{
                height: "54px",
                borderRadius: "16px",
                background: "linear-gradient(135deg, #4B168C 0%, #3B1170 100%)",
                boxShadow: "0 4px 18px rgba(75,22,140,0.35)",
                border: "1.5px solid #D6A52A",
                cursor: step === "sending" ? "default" : "pointer",
                color: "white",
                fontSize: "15px",
                fontWeight: 700,
              }}
            >
              {step === "sending" ? (
                <>
                  <svg className="animate-spin" width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
                    <circle cx="9" cy="9" r="7" stroke="rgba(255,255,255,0.35)" strokeWidth="2" />
                    <path d="M9 2a7 7 0 017 7" stroke="white" strokeWidth="2" strokeLinecap="round" />
                  </svg>
                  <span>Sending code…</span>
                </>
              ) : (
                "Send Reset Instructions"
              )}
            </button>
          </div>
        ) : (
          <div className="flex flex-col items-center text-center pt-8">
            <div
              className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
              style={{ background: "#dcfce7", border: "2px solid #86efac" }}
              aria-hidden="true"
            >
              <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                <path d="M8 16l6 6L24 10" stroke="#16a34a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <h2
              style={{
                fontSize: "22px",
                fontWeight: 700,
                color: "#0d1b3e",
                marginBottom: "8px",
                fontFamily: "'Inter', system-ui",
              }}
            >
              Check your inbox
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", lineHeight: 1.6, marginBottom: "28px" }}>
              We&apos;ve sent password recovery instructions to:
              <br />
              <strong style={{ color: "#0d1b3e" }}>{email}</strong>
            </p>

            <button
              type="button"
              onClick={() => navigate("login")}
              className="w-full flex items-center justify-center transition-all duration-200 active:scale-[0.98]"
              style={{
                height: "52px",
                borderRadius: "16px",
                background: "linear-gradient(135deg,#06b6d4,#0891b2)",
                boxShadow: "0 4px 20px rgba(6,182,212,0.35)",
                border: "none",
                cursor: "pointer",
                color: "white",
                fontSize: "15px",
                fontWeight: 700,
                marginBottom: "12px",
              }}
            >
              Return to Log in
            </button>
          </div>
        )}
      </div>

      <div className="flex-shrink-0 flex justify-center pb-4 pt-2">
        <div className="w-32 h-1 rounded-full" style={{ background: "#0d1b3e", opacity: 0.15 }} aria-hidden="true" />
      </div>
    </div>
  );
}

```

---

### SECTION 4.11: CRITICAL CONGESTION ADVISORY MODAL SCREEN
**Target Path:** `src/app/components/screens/CriticalAlertScreen.tsx`  
**Language:** `tsx` | **Line Count:** `172`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx
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
    <div
      style={{
        width: "100%",
        height: "100%",
        fontFamily: "'Inter', system-ui",
        background: "#FFFFFF",
        display: "flex",
        flexDirection: "column",
        opacity: dismissing ? 0 : 1,
        transition: "opacity 0.3s ease",
      }}
    >
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

```

---

### SECTION 4.12: CAMPUS PROFILE & ACADEMIC DISCLOSURE SCREEN
**Target Path:** `src/app/components/screens/ProfileScreen.tsx`  
**Language:** `tsx` | **Line Count:** `355`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx
import { useState } from "react";
import { Screen, TrafficState, UniversitySystemInfo, NotificationSettings } from "../../types";

interface ProfileScreenProps {
  navigate: (screen: Screen) => void;
  systemInfo?: UniversitySystemInfo;
  trafficState: TrafficState;
  notificationSettings: NotificationSettings;
  onUpdateNotifications: (settings: Partial<NotificationSettings>) => void;
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

function SystemIcon({ active }: { active: boolean }) {
  const c = active ? "#4B168C" : "#94A3B8";
  return (
    <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="3" stroke={c} strokeWidth="1.8" fill={active ? "rgba(75, 22, 140, 0.12)" : "none"} />
      <path
        d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06a1.65 1.65 0 001.82.33H9a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"
        stroke={c}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileScreen({ navigate, trafficState }: ProfileScreenProps) {
  const [showArchModal, setShowArchModal] = useState(false);

  const navTabs: NavTab[] = [
    { id: "dashboard", label: "Home", icon: (a) => <HomeIcon active={a} /> },
    { id: "live-map", label: "Live Map", icon: (a) => <MapIcon active={a} /> },
    { id: "alerts", label: "Alerts", icon: (a) => <BellIcon active={a} /> },
    { id: "analytics", label: "Analytics", icon: (a) => <ChartIcon active={a} /> },
    { id: "sensors-settings", label: "System", icon: (a) => <SystemIcon active={a} /> },
  ];

  return (
    <div
      className="flex flex-col h-full relative"
      style={{ background: "#F7F4FB", fontFamily: "'Inter', system-ui, sans-serif" }}
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
            className="flex items-center justify-center w-7 h-7 rounded-lg transition-all active:scale-90"
            style={{ background: "#F0EAF7", border: "1px solid #EADBFA", cursor: "pointer" }}
          >
            <span style={{ fontSize: "12px", color: "#4B168C" }}>◀</span>
          </button>
          <div>
            <h1 style={{ fontSize: "18px", fontWeight: 800, color: "#17172F", lineHeight: 1.1 }}>
              System &amp; Campus Info
            </h1>
            <p style={{ fontSize: "11px", color: "#6B6B80" }}>
              MIT-ADT University • Project Context
            </p>
          </div>
        </div>
      </div>

      {/* ── Scrollable Body ── */}
      <div className="flex-1 overflow-y-auto px-5 pt-4 pb-4" style={{ scrollbarWidth: "none" }}>

        {/* ── University Header Card ── */}
        <div
          className="rounded-3xl p-4 mb-4 text-center"
          style={{
            background: "linear-gradient(135deg, #4B168C 0%, #17172F 100%)",
            color: "#FFFFFF",
            boxShadow: "0 4px 16px rgba(75, 22, 140, 0.25)",
            border: "1.5px solid #D6A52A",
          }}
        >
          <div className="w-12 h-12 rounded-2xl mx-auto mb-2 flex items-center justify-center bg-white/10 border border-[#D6A52A]">
            <span style={{ fontSize: "22px" }}>🏛️</span>
          </div>
          <h2 style={{ fontSize: "17px", fontWeight: 800, letterSpacing: "-0.3px" }}>
            MIT-ADT University, Pune
          </h2>
          <p style={{ fontSize: "11.5px", color: "#D6A52A", fontWeight: 600, marginTop: "2px" }}>
            Rajbaug Campus • Loni Kalbhor
          </p>
          <div className="mt-3 pt-3 border-t border-white/15 flex items-center justify-around text-[10.5px]">
            <div>
              <span className="text-white/60 block">Scope</span>
              <strong className="text-white">Main Campus Gate</strong>
            </div>
            <div>
              <span className="text-white/60 block">Version</span>
              <strong className="text-white">TraffiQ v1.2</strong>
            </div>
            <div>
              <span className="text-white/60 block">Session</span>
              <strong className="text-white">Guest Evaluator</strong>
            </div>
          </div>
        </div>

        {/* ── Deployment Scope Details Card ── */}
        <div
          className="rounded-2xl p-4 mb-3.5"
          style={{ background: "#FFFFFF", border: "1px solid #EADBFA", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
        >
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#17172F", marginBottom: "8px" }}>
            📍 Prototype Deployment Scope
          </h3>
          <p style={{ fontSize: "11.5px", color: "#4B5563", lineHeight: 1.5, marginBottom: "10px" }}>
            The current system deployment is scoped strictly to <strong>ONE GATE: Main Campus Gate</strong>, which handles the primary vehicular inflow and outflow between the university and Pune-Solapur Road (NH 65).
          </p>
          <div className="rounded-xl p-2.5 text-[11px] text-[#4B168C]" style={{ background: "#F0EAF7" }}>
            ✓ Monitored Gate: <strong>Main Campus Gate</strong><br />
            ⏳ Future Expansion: North Gate, South Gate, Hostel Gate
          </div>
        </div>

        {/* ── Architecture Summary ── */}
        <div
          className="rounded-2xl p-4 mb-3.5"
          style={{ background: "#FFFFFF", border: "1px solid #EADBFA", boxShadow: "0 1px 4px rgba(0,0,0,0.03)" }}
        >
          <h3 style={{ fontSize: "13px", fontWeight: 800, color: "#17172F", marginBottom: "8px" }}>
            ⚙️ Hardware &amp; Cloud Architecture
          </h3>
          <div className="flex flex-col gap-2 text-[11.5px] text-slate-600">
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#4B168C]">1.</span>
              <span><strong>Edge Node:</strong> PIR Motion Sensor (GPIO 17) + HC-SR04 Ultrasonic Distance Sensor on Raspberry Pi 4.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#4B168C]">2.</span>
              <span><strong>Transport:</strong> MQTT over TLS to AWS IoT Core (ap-south-1 Mumbai region).</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#4B168C]">3.</span>
              <span><strong>Processing &amp; Store:</strong> AWS Lambda event rules streaming to Amazon DynamoDB.</span>
            </div>
            <div className="flex items-start gap-2">
              <span className="font-bold text-[#4B168C]">4.</span>
              <span><strong>Application:</strong> Responsive React 18 + TypeScript client with MapLibre GL JS campus cartography.</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setShowArchModal(true)}
            className="w-full mt-3 py-2 rounded-xl text-[11.5px] font-bold text-[#4B168C] transition-all"
            style={{ background: "#F0EAF7", border: "1px solid #EADBFA", cursor: "pointer" }}
          >
            View Architecture Diagram Details
          </button>
        </div>

        {/* ── Diagnostics Navigation Shortcut ── */}
        <button
          type="button"
          onClick={() => navigate("sensors-settings")}
          className="w-full flex items-center justify-between p-3.5 rounded-2xl transition-all mb-3"
          style={{ background: "#FFFFFF", border: "1.5px solid #4B168C", cursor: "pointer" }}
        >
          <div className="flex items-center gap-2.5">
            <span style={{ fontSize: "18px" }}>🎛️</span>
            <div className="text-left">
              <p style={{ fontSize: "13px", fontWeight: 700, color: "#17172F" }}>
                Open Interactive Simulator
              </p>
              <p style={{ fontSize: "10.5px", color: "#6B6B80" }}>
                Switch simulator presets &amp; test responses
              </p>
            </div>
          </div>
          <span style={{ fontSize: "16px", color: "#4B168C" }}>→</span>
        </button>

      </div>

      {/* ── Architecture Details Modal ── */}
      {showArchModal && (
        <div
          className="absolute inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(23, 23, 47, 0.75)", backdropFilter: "blur(4px)" }}
        >
          <div
            className="w-full max-w-sm rounded-3xl p-5"
            style={{ background: "#FFFFFF", border: "2px solid #D6A52A" }}
          >
            <div className="flex items-center justify-between mb-3">
              <h3 style={{ fontSize: "15px", fontWeight: 800, color: "#17172F" }}>
                TraffiQ System Architecture
              </h3>
              <button
                type="button"
                onClick={() => setShowArchModal(false)}
                className="text-slate-400 hover:text-slate-600 font-bold"
                style={{ background: "none", border: "none", cursor: "pointer" }}
              >
                ✕
              </button>
            </div>
            <div className="text-[11.5px] text-slate-600 space-y-2 mb-4 leading-relaxed">
              <p>
                <strong>Hardware:</strong> Prototype breadboard test setup with HC-SR04 measuring distance to barrier arms and PIR motion sensor recording trigger pulses.
              </p>
              <p>
                <strong>Truthful Telemetry:</strong> Precise vehicle counts require multi-lane camera counting algorithms. TraffiQ honestly surfaces motion frequency and distance measurements as an engineering prototype.
              </p>
              <p>
                <strong>Location:</strong> Rajbaug Campus, Loni Kalbhor, Pune, Maharashtra 412201.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowArchModal(false)}
              className="w-full py-2.5 rounded-xl text-[13px] font-bold text-white"
              style={{ background: "#4B168C", border: "none", cursor: "pointer" }}
            >
              Close
            </button>
          </div>
        </div>
      )}

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
              const isActive = tab.id === "sensors-settings";
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
                      fontSize: "10px",
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

```

---

### SECTION 4.13: DESIGN SYSTEM CLASS MERGE UTILITY
**Target Path:** `src/app/components/ui/utils.ts`  
**Language:** `typescript` | **Line Count:** `6`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```typescript
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

```

---

### SECTION 4.14: RASPBERRY PI 4 IOT EDGE TELEMETRY COLLECTOR
**Target Path:** `src/edge/gate_sensor_node.py`  
**Language:** `python` | **Line Count:** `234`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```python
"""
================================================================================
PROJECT: TraffiQ — MIT-ADT Campus Smart Traffic and Gate Monitoring System
MODULE: Edge IoT Node Telemetry Collector
COPYRIGHT: Copyright (c) 2026 — Authors: Rajani Sangappa Sajjan,
           Nikunj Santosh Hogade, Adwait Pravin Kharade,
           Shriraj Omkar Salunke, and Arayan Atul Londhe.
           All Rights Reserved.
PROJECT LOCATION: MIT Art, Design and Technology University, Rajbaug Campus,
                  Loni Kalbhor, Pune - 412201, Maharashtra, India
================================================================================
HARDWARE TARGET: Raspberry Pi 4 Model B
SENSORS:
  - PIR Motion Sensor: GPIO 17 (Digital Input)
  - HC-SR04 Ultrasonic Sensor: Trig GPIO 27, Echo GPIO 22
CONNECTIVITY: AWS IoT Core (ap-south-1 Mumbai) via MQTT over TLS (Port 8883)
MQTT TOPIC: mitadt/campus/gate/main/telemetry
================================================================================
"""

import os
import sys
import time
import json
import logging
from datetime import datetime
from typing import Dict, Any, Optional

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("TraffiQ-EdgeNode")

# Hardware Pins Configuration (BCM numbering)
PIR_GPIO_PIN = 17
ULTRASONIC_TRIG_PIN = 27
ULTRASONIC_ECHO_PIN = 22

# MQTT Configuration
AWS_REGION = "ap-south-1"
AWS_IOT_TOPIC = "mitadt/campus/gate/main/telemetry"
DEVICE_CLIENT_ID = "mitadt-main-gate-rpi4-node"

# Attempt importing hardware libraries (gracefully fallback if run in simulation/non-RPi)
try:
    import RPi.GPIO as GPIO
    HARDWARE_AVAILABLE = True
except (ImportError, RuntimeError):
    HARDWARE_AVAILABLE = False
    logger.warning("RPi.GPIO not detected. Running Edge Collector in simulated telemetry mode.")

try:
    from awsiot import mqtt_connection_builder
    from awscrt import io, mqtt
    AWS_SDK_AVAILABLE = True
except ImportError:
    AWS_SDK_AVAILABLE = False
    logger.info("AWS IoT Device SDK not installed. Telemetry will output to local stream/log.")


class GateSensorNode:
    """
    Edge IoT controller deployed at MIT-ADT University Main Campus Gate.
    Continuously monitors barrier clearance distance and vehicle queue motion frequency.
    """

    def __init__(self, simulation_mode: bool = False):
        self.simulation_mode = simulation_mode or (not HARDWARE_AVAILABLE)
        self.pir_trigger_count = 0
        self.window_start_time = time.time()
        self.mqtt_connection = None

        if not self.simulation_mode:
            self._init_gpio()

    def _init_gpio(self) -> None:
        """Initialize Raspberry Pi GPIO pin mappings."""
        try:
            GPIO.setmode(GPIO.BCM)
            GPIO.setwarnings(False)

            # Setup PIR Motion Sensor
            GPIO.setup(PIR_GPIO_PIN, GPIO.IN, pull_up_down=GPIO.PUD_DOWN)
            GPIO.add_event_detect(PIR_GPIO_PIN, GPIO.RISING, callback=self._on_pir_motion, bouncetime=200)

            # Setup HC-SR04 Ultrasonic Sensor
            GPIO.setup(ULTRASONIC_TRIG_PIN, GPIO.OUT)
            GPIO.setup(ULTRASONIC_ECHO_PIN, GPIO.IN)
            GPIO.output(ULTRASONIC_TRIG_PIN, False)

            logger.info("GPIO pins initialized successfully: PIR=17, TRIG=27, ECHO=22")
        except Exception as exc:
            logger.error(f"Failed to initialize GPIO: {exc}")
            self.simulation_mode = True

    def _on_pir_motion(self, channel: int) -> None:
        """Hardware interrupt callback triggered by PIR motion detection."""
        self.pir_trigger_count += 1

    def measure_ultrasonic_distance(self) -> Optional[float]:
        """
        Calculates distance to barrier / vehicle queue using HC-SR04 ultrasonic echo timing.
        Returns distance in meters, or None if timeout occurs.
        """
        if self.simulation_mode:
            # Simulate realistic barrier distance between 1.5m (crowded) to 8.0m (clear)
            return round(5.5, 2)

        try:
            # Trigger 10µs ultrasonic pulse
            GPIO.output(ULTRASONIC_TRIG_PIN, True)
            time.sleep(0.00001)
            GPIO.output(ULTRASONIC_TRIG_PIN, False)

            pulse_start = time.time()
            pulse_end = time.time()
            timeout = pulse_start + 0.05  # 50ms maximum wait

            # Record pulse start
            while GPIO.input(ULTRASONIC_ECHO_PIN) == 0:
                pulse_start = time.time()
                if pulse_start > timeout:
                    return None

            # Record pulse end
            while GPIO.input(ULTRASONIC_ECHO_PIN) == 1:
                pulse_end = time.time()
                if pulse_end > timeout:
                    return None

            pulse_duration = pulse_end - pulse_start
            # Speed of sound = 34300 cm/s -> distance = (duration * 34300) / 2
            distance_cm = (pulse_duration * 34300) / 2
            distance_m = round(distance_cm / 100.0, 2)
            return distance_m
        except Exception as exc:
            logger.error(f"Ultrasonic measurement error: {exc}")
            return None

    def calculate_traffic_metrics(self) -> Dict[str, Any]:
        """
        Evaluates sliding 60-second window metrics and derives truthful telemetry.
        """
        now = time.time()
        elapsed = max(now - self.window_start_time, 1.0)
        # Normalize triggers to 60-second equivalent
        triggers_per_min = int((self.pir_trigger_count / elapsed) * 60)

        # Reset sliding window
        self.pir_trigger_count = 0
        self.window_start_time = now

        measured_dist = self.measure_ultrasonic_distance()

        # Severity categorization heuristic based on honest sensor measurements
        if measured_dist is None:
            traffic_level = "Sensor Offline"
            motion_activity = "None"
        elif measured_dist < 2.0 and triggers_per_min > 18:
            traffic_level = "Heavy Traffic"
            motion_activity = "High"
        elif measured_dist < 4.0 or triggers_per_min > 8:
            traffic_level = "Moderate Traffic"
            motion_activity = "Moderate"
        else:
            traffic_level = "Low Traffic"
            motion_activity = "Low"

        payload = {
            "version": "1.0.0",
            "institution": "MIT Art, Design and Technology University, Pune",
            "campus": "Rajbaug Campus, Loni Kalbhor",
            "gateId": "main",
            "gateName": "Main Campus Gate",
            "timestamp": datetime.utcnow().isoformat() + "Z",
            "telemetry": {
                "trafficLevel": traffic_level,
                "motionActivity": motion_activity,
                "pirTriggersPerMin": triggers_per_min,
                "measuredDistance": f"{measured_dist:.1f} m" if measured_dist is not None else "--",
                "pirStatus": "online" if not self.simulation_mode else "demo",
                "ultrasonicStatus": "online" if measured_dist is not None else "offline",
                "nodeHealth": "operational"
            },
            "edgeHardware": {
                "nodeModel": "Raspberry Pi 4 Model B (4GB RAM)",
                "gpioMapping": {
                    "pir": PIR_GPIO_PIN,
                    "ultrasonic_trig": ULTRASONIC_TRIG_PIN,
                    "ultrasonic_echo": ULTRASONIC_ECHO_PIN
                },
                "simulated": self.simulation_mode
            }
        }
        return payload

    def publish_telemetry(self, payload: Dict[str, Any]) -> None:
        """Dispatches telemetry JSON to AWS IoT Core MQTT topic."""
        message_json = json.dumps(payload, indent=2)
        if self.mqtt_connection and AWS_SDK_AVAILABLE:
            try:
                self.mqtt_connection.publish(
                    topic=AWS_IOT_TOPIC,
                    payload=message_json,
                    qos=mqtt.QoS.AT_LEAST_ONCE
                )
                logger.info(f"Published telemetry to AWS IoT topic [{AWS_IOT_TOPIC}]")
            except Exception as exc:
                logger.error(f"MQTT publish failed: {exc}")
        else:
            logger.info(f"[TELEMETRY EMIT] Topic: {AWS_IOT_TOPIC}\n{message_json}")

    def cleanup(self) -> None:
        """Release hardware GPIO resources cleanly."""
        if not self.simulation_mode and HARDWARE_AVAILABLE:
            GPIO.cleanup()
            logger.info("GPIO resources cleanly released.")


if __name__ == "__main__":
    logger.info("Starting TraffiQ Edge Sensor Node...")
    node = GateSensorNode()
    try:
        while True:
            # Poll every 5 seconds for telemetry report
            time.sleep(5)
            telemetry = node.calculate_traffic_metrics()
            node.publish_telemetry(telemetry)
    except KeyboardInterrupt:
        logger.info("Shutdown signal received.")
    finally:
        node.cleanup()

```

---

### SECTION 4.15: AWS LAMBDA CLOUD RULE EVALUATOR & DYNAMODB HANDLER
**Target Path:** `src/cloud/lambda_telemetry_processor.py`  
**Language:** `python` | **Line Count:** `107`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```python
"""
================================================================================
PROJECT: TraffiQ — MIT-ADT Campus Smart Traffic and Gate Monitoring System
MODULE: AWS Lambda Cloud Telemetry Processor & Rule Evaluator
COPYRIGHT: Copyright (c) 2026 — Authors: Rajani Sangappa Sajjan,
           Nikunj Santosh Hogade, Adwait Pravin Kharade,
           Shriraj Omkar Salunke, and Arayan Atul Londhe.
           All Rights Reserved.
PROJECT LOCATION: MIT Art, Design and Technology University, Rajbaug Campus,
                  Loni Kalbhor, Pune - 412201, Maharashtra, India
================================================================================
RUNTIME: Python 3.11 / AWS Lambda (ap-south-1 Mumbai)
TRIGGER: AWS IoT Rule on Topic: mitadt/campus/gate/main/telemetry
PERSISTENCE: Amazon DynamoDB Table: MITADT_Campus_Traffic_Telemetry
================================================================================
"""

import os
import json
import logging
from datetime import datetime
from typing import Dict, Any

# Configure Logging
logger = logging.getLogger()
logger.setLevel(logging.INFO)

# Optional boto3 import for deployment in AWS Lambda environment
try:
    import boto3
    dynamodb = boto3.resource("dynamodb", region_name="ap-south-1")
    table_name = os.environ.get("DYNAMODB_TABLE_NAME", "MITADT_Campus_Traffic_Telemetry")
    table = dynamodb.Table(table_name)
    AWS_BOTO_AVAILABLE = True
except ImportError:
    table = None
    AWS_BOTO_AVAILABLE = False
    logger.info("Running in offline verification mode without AWS boto3.")


def lambda_handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    AWS Lambda ingestion handler for MIT-ADT Main Campus Gate telemetry.
    Parses payload from AWS IoT Core, evaluates congestion rules, and stores record in DynamoDB.
    """
    logger.info(f"Received IoT event: {json.dumps(event)}")

    # Extract core telemetry attributes
    gate_id = event.get("gateId", "main")
    timestamp = event.get("timestamp", datetime.utcnow().isoformat() + "Z")
    telemetry = event.get("telemetry", {})

    traffic_level = telemetry.get("trafficLevel", "Low Traffic")
    pir_triggers = telemetry.get("pirTriggersPerMin", 0)
    measured_dist = telemetry.get("measuredDistance", "--")
    pir_status = telemetry.get("pirStatus", "online")
    ultrasonic_status = telemetry.get("ultrasonicStatus", "online")

    # Evaluate Travel Recommendations & Delay Estimates
    estimated_delay = "< 1 min (Clear)"
    recommendation = "Clear passage. Free flow exiting onto Pune-Solapur Highway access road."

    if traffic_level == "Heavy Traffic":
        estimated_delay = "8 - 12 mins delay"
        recommendation = "Heavy vehicle queuing before security checkpoint. Consider staggering departure."
    elif traffic_level == "Moderate Traffic":
        estimated_delay = "3 - 5 mins delay"
        recommendation = "Slow vehicle movement. Normal clearance speed at Main Gate."
    elif traffic_level == "Sensor Offline":
        estimated_delay = "Status Unknown"
        recommendation = "Edge sensor telemetry offline. Proceed with standard caution."

    processed_record = {
        "gateId": gate_id,
        "timestamp": timestamp,
        "trafficLevel": traffic_level,
        "motionActivity": telemetry.get("motionActivity", "Low"),
        "pirTriggersPerMin": pir_triggers,
        "measuredDistance": measured_dist,
        "estimatedDelay": estimated_delay,
        "recommendation": recommendation,
        "pirStatus": pir_status,
        "ultrasonicStatus": ultrasonic_status,
        "campus": "MIT-ADT University Rajbaug Campus, Loni Kalbhor",
        "highway": "Pune-Solapur Highway (NH 65)",
        "ttl": int(datetime.utcnow().timestamp()) + (86400 * 30) # 30-day retention
    }

    # Persist record in DynamoDB
    if AWS_BOTO_AVAILABLE and table:
        try:
            table.put_item(Item=processed_record)
            logger.info(f"Persisted record to DynamoDB: {gate_id} @ {timestamp}")
        except Exception as exc:
            logger.error(f"Error persisting record to DynamoDB: {exc}")
            return {
                "statusCode": 500,
                "body": json.dumps({"error": str(exc)})
            }

    return {
        "statusCode": 200,
        "body": json.dumps({
            "message": "Telemetry evaluated and stored successfully.",
            "record": processed_record
        })
    }

```

---

### SECTION 4.16: APPLICATION REACT DOM ENTRY POINT
**Target Path:** `src/main.tsx`  
**Language:** `tsx` | **Line Count:** `7`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```tsx

  import { createRoot } from "react-dom/client";
  import App from "./app/App.tsx";
  import "./styles/index.css";

  createRoot(document.getElementById("root")!).render(<App />);
  
```

---

### SECTION 4.17: MIT-ADT VISUAL IDENTITY DESIGN SYSTEM TOKENS
**Target Path:** `src/styles/theme.css`  
**Language:** `css` | **Line Count:** `181`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```css
@custom-variant dark (&:is(.dark *));

:root {
  --font-size: 16px;
  --background: #f7f4fb;
  --foreground: #17172f;
  --card: #ffffff;
  --card-foreground: #17172f;
  --popover: #ffffff;
  --popover-foreground: #17172f;
  --primary: #4b168c;
  --primary-foreground: #ffffff;
  --secondary: #f0eaf7;
  --secondary-foreground: #4b168c;
  --muted: #f4effa;
  --muted-foreground: #6b6b80;
  --accent: #d6a52a;
  --accent-foreground: #17172f;
  --destructive: #dc2626;
  --destructive-foreground: #ffffff;
  --border: rgba(75, 22, 140, 0.12);
  --input: transparent;
  --input-background: #f8f6fc;
  --switch-background: #d8cde6;
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --ring: oklch(0.708 0 0);
  --chart-1: oklch(0.646 0.222 41.116);
  --chart-2: oklch(0.6 0.118 184.704);
  --chart-3: oklch(0.398 0.07 227.392);
  --chart-4: oklch(0.828 0.189 84.429);
  --chart-5: oklch(0.769 0.188 70.08);
  --radius: 0.625rem;
  --sidebar: oklch(0.985 0 0);
  --sidebar-foreground: oklch(0.145 0 0);
  --sidebar-primary: #030213;
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.97 0 0);
  --sidebar-accent-foreground: oklch(0.205 0 0);
  --sidebar-border: oklch(0.922 0 0);
  --sidebar-ring: oklch(0.708 0 0);
}

.dark {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.145 0 0);
  --card-foreground: oklch(0.985 0 0);
  --popover: oklch(0.145 0 0);
  --popover-foreground: oklch(0.985 0 0);
  --primary: oklch(0.985 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --secondary: oklch(0.269 0 0);
  --secondary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
  --accent: oklch(0.269 0 0);
  --accent-foreground: oklch(0.985 0 0);
  --destructive: oklch(0.396 0.141 25.723);
  --destructive-foreground: oklch(0.637 0.237 25.331);
  --border: oklch(0.269 0 0);
  --input: oklch(0.269 0 0);
  --ring: oklch(0.439 0 0);
  --font-weight-medium: 500;
  --font-weight-normal: 400;
  --chart-1: oklch(0.488 0.243 264.376);
  --chart-2: oklch(0.696 0.17 162.48);
  --chart-3: oklch(0.769 0.188 70.08);
  --chart-4: oklch(0.627 0.265 303.9);
  --chart-5: oklch(0.645 0.246 16.439);
  --sidebar: oklch(0.205 0 0);
  --sidebar-foreground: oklch(0.985 0 0);
  --sidebar-primary: oklch(0.488 0.243 264.376);
  --sidebar-primary-foreground: oklch(0.985 0 0);
  --sidebar-accent: oklch(0.269 0 0);
  --sidebar-accent-foreground: oklch(0.985 0 0);
  --sidebar-border: oklch(0.269 0 0);
  --sidebar-ring: oklch(0.439 0 0);
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-destructive-foreground: var(--destructive-foreground);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-input-background: var(--input-background);
  --color-switch-background: var(--switch-background);
  --color-ring: var(--ring);
  --color-chart-1: var(--chart-1);
  --color-chart-2: var(--chart-2);
  --color-chart-3: var(--chart-3);
  --color-chart-4: var(--chart-4);
  --color-chart-5: var(--chart-5);
  --radius-sm: calc(var(--radius) - 4px);
  --radius-md: calc(var(--radius) - 2px);
  --radius-lg: var(--radius);
  --radius-xl: calc(var(--radius) + 4px);
  --color-sidebar: var(--sidebar);
  --color-sidebar-foreground: var(--sidebar-foreground);
  --color-sidebar-primary: var(--sidebar-primary);
  --color-sidebar-primary-foreground: var(--sidebar-primary-foreground);
  --color-sidebar-accent: var(--sidebar-accent);
  --color-sidebar-accent-foreground: var(--sidebar-accent-foreground);
  --color-sidebar-border: var(--sidebar-border);
  --color-sidebar-ring: var(--sidebar-ring);
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }

  body {
    @apply bg-background text-foreground;
  }

  /**
  * Default typography styles for HTML elements (h1-h4, p, label, button, input).
  * These are in @layer base, so Tailwind utility classes (like text-sm, text-lg) automatically override them.
  */

  html {
    font-size: var(--font-size);
  }

  h1 {
    font-size: var(--text-2xl);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  h2 {
    font-size: var(--text-xl);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  h3 {
    font-size: var(--text-lg);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  h4 {
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  label {
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  button {
    font-size: var(--text-base);
    font-weight: var(--font-weight-medium);
    line-height: 1.5;
  }

  input {
    font-size: var(--text-base);
    font-weight: var(--font-weight-normal);
    line-height: 1.5;
  }
}

```

---

### SECTION 4.18: VITE BUILD & BUNDLER CONFIGURATION
**Target Path:** `vite.config.ts`  
**Language:** `typescript` | **Line Count:** `41`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```typescript
import { defineConfig } from 'vite'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'


function figmaAssetResolver() {
  return {
    name: 'figma-asset-resolver',
    resolveId(id) {
      if (id.startsWith('figma:asset/')) {
        const filename = id.replace('figma:asset/', '')
        return path.resolve(__dirname, 'src/assets', filename)
      }
    },
  }
}

export default defineConfig({
  plugins: [
    figmaAssetResolver(),
    // The React and Tailwind plugins are both required for Make, even if
    // Tailwind is not being actively used – do not remove them
    react(),
    tailwindcss(),
  ],
  resolve: {
    alias: {
      // Alias @ to the src directory
      '@': path.resolve(__dirname, './src'),
    },
  },

  // OptimizeDeps configuration to handle MapLibre GL worker
  optimizeDeps: {
    exclude: ['maplibre-gl'],
  },

  // File types to support raw imports. Never add .css, .tsx, or .ts files to this.
  assetsInclude: ['**/*.svg', '**/*.csv'],
})

```

---

### SECTION 4.19: PROJECT MANIFEST & DEPENDENCY SPECIFICATIONS
**Target Path:** `package.json`  
**Language:** `json` | **Line Count:** `92`  
**Copyright:** `Copyright © 2026 — Authors: Rajani Sangappa Sajjan, Nikunj Santosh Hogade, Adwait Pravin Kharade, Shriraj Omkar Salunke, and Arayan Atul Londhe. All Rights Reserved.`  
**Project Location:** `MIT Art, Design and Technology University, Rajbaug Campus, Loni Kalbhor, Pune – 412201, Maharashtra, India`

```json
{
  "name": "@figma/my-make-file",
  "private": true,
  "version": "0.0.1",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "start": "vite",
    "build": "vite build"
  },
  "dependencies": {
    "@emotion/react": "11.14.0",
    "@emotion/styled": "11.14.1",
    "@mui/icons-material": "7.3.5",
    "@mui/material": "7.3.5",
    "@popperjs/core": "2.11.8",
    "@radix-ui/react-accordion": "1.2.3",
    "@radix-ui/react-alert-dialog": "1.1.6",
    "@radix-ui/react-aspect-ratio": "1.1.2",
    "@radix-ui/react-avatar": "1.1.3",
    "@radix-ui/react-checkbox": "1.1.4",
    "@radix-ui/react-collapsible": "1.1.3",
    "@radix-ui/react-context-menu": "2.2.6",
    "@radix-ui/react-dialog": "1.1.6",
    "@radix-ui/react-dropdown-menu": "2.1.6",
    "@radix-ui/react-hover-card": "1.1.6",
    "@radix-ui/react-label": "2.1.2",
    "@radix-ui/react-menubar": "1.1.6",
    "@radix-ui/react-navigation-menu": "1.2.5",
    "@radix-ui/react-popover": "1.1.6",
    "@radix-ui/react-progress": "1.1.2",
    "@radix-ui/react-radio-group": "1.2.3",
    "@radix-ui/react-scroll-area": "1.2.3",
    "@radix-ui/react-select": "2.1.6",
    "@radix-ui/react-separator": "1.1.2",
    "@radix-ui/react-slider": "1.2.3",
    "@radix-ui/react-slot": "1.1.2",
    "@radix-ui/react-switch": "1.1.3",
    "@radix-ui/react-tabs": "1.1.3",
    "@radix-ui/react-toggle": "1.1.2",
    "@radix-ui/react-toggle-group": "1.1.2",
    "@radix-ui/react-tooltip": "1.1.8",
    "canvas-confetti": "1.9.4",
    "class-variance-authority": "0.7.1",
    "clsx": "2.1.1",
    "cmdk": "1.1.1",
    "date-fns": "3.6.0",
    "embla-carousel-react": "8.6.0",
    "input-otp": "1.4.2",
    "lucide-react": "0.487.0",
    "maplibre-gl": "^6.13.0",
    "motion": "12.23.24",
    "next-themes": "0.4.6",
    "react-day-picker": "8.10.1",
    "react-dnd": "16.0.1",
    "react-dnd-html5-backend": "16.0.1",
    "react-hook-form": "7.55.0",
    "react-popper": "2.3.0",
    "react-resizable-panels": "2.1.7",
    "react-responsive-masonry": "2.7.1",
    "react-router": "7.13.0",
    "react-slick": "0.31.0",
    "recharts": "2.15.2",
    "sonner": "2.0.3",
    "tailwind-merge": "3.2.0",
    "tw-animate-css": "1.3.8",
    "vaul": "1.1.2"
  },
  "devDependencies": {
    "@tailwindcss/vite": "4.1.12",
    "@vitejs/plugin-react": "4.7.0",
    "tailwindcss": "4.1.12",
    "vite": "6.3.5"
  },
  "peerDependencies": {
    "react": "18.3.1",
    "react-dom": "18.3.1"
  },
  "peerDependenciesMeta": {
    "react": {
      "optional": true
    },
    "react-dom": {
      "optional": true
    }
  },
  "pnpm": {
    "overrides": {
      "vite": "6.3.5"
    }
  }
}
```

---

## 5. APPLICANTS' STATEMENT AND PRE-SUBMISSION VERIFICATION

This document contains the source code of the TraffiQ system as authored by the applicants. The applicants must review, verify, and confirm the document contents prior to executing and uploading to the Copyright Office portal.

**Applicants & Authors:**
- Rajani Sangappa Sajjan
- Nikunj Santosh Hogade
- Adwait Pravin Kharade
- Shriraj Omkar Salunke
- Arayan Atul Londhe

- **Date:** October 2026
- **Place:** Pune, Maharashtra, India
