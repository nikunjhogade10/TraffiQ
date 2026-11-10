import { useState, useEffect } from "react";
import { LoginScreen } from "./components/screens/LoginScreen";
import { SignUpScreen } from "./components/screens/SignUpScreen";
import { ForgotPasswordScreen } from "./components/screens/ForgotPasswordScreen";
import { DashboardScreen } from "./components/screens/DashboardScreen";
import { LiveMapScreen } from "./components/screens/LiveMapScreen";
import { GateTrafficDetailsScreen } from "./components/screens/GateTrafficDetailsScreen";
import { CriticalAlertScreen } from "./components/screens/CriticalAlertScreen";
import { AlertsScreen } from "./components/screens/AlertsScreen";
import { AnalyticsScreen } from "./components/screens/AnalyticsScreen";
import { ProfileScreen } from "./components/screens/ProfileScreen";
import {
  Screen,
  TrafficState,
  SensorTelemetry,
  NotificationSettings,
  UniversitySystemInfo,
  UserSession,
  UserRole,
} from "./types";
import { authService } from "./services/authService";
import { SplashScreen } from "./components/screens/SplashScreen";

export default function App() {
  // Check persistent active session from local storage database
  const [userSession, setUserSession] = useState<UserSession>(() => {
    const saved = authService.getActiveSession();
    return saved || { type: "guest", joinedAt: "Just now" };
  });

  // Auto-login: If an authenticated session is found, directly bypass login to dashboard!
  const [screen, setScreen] = useState<Screen>(() => {
    const saved = authService.getActiveSession();
    return saved ? "dashboard" : "login";
  });

  // App launch branded splash screen (shows on cold start & re-open)
  const [showSplash, setShowSplash] = useState<boolean>(true);

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
    rpiHardwareNote: "Raspberry Pi 3B+ Edge Node",
    awsIotStatus: "connected",
    awsTopic: "mitadt/campus/gate/main/telemetry",
    awsRegion: "Mumbai",
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

  // Track whether user manually paused live stream to test demo presets
  const [liveStreamActive, setLiveStreamActive] = useState<boolean>(true);

  // ── Live Raspberry Pi Hardware Telemetry Polling ──
  useEffect(() => {
    let isMounted = true;

    const pollLiveTelemetry = async () => {
      if (!liveStreamActive) return;

      try {
        let response: Response | null = null;
        try {
          const res = await fetch("/api/pi/telemetry");
          if (res.ok) response = res;
        } catch {}

        if (!response) {
          const fetchPromise = fetch("http://192.168.1.14:8000/telemetry");
          const timeoutPromise = new Promise<Response>((_, reject) =>
            setTimeout(() => reject(new Error("Timeout")), 2500)
          );
          response = (await Promise.race([fetchPromise, timeoutPromise])) as Response;
        }

        if (response && response.ok) {
          const data = await response.json();
          if (!isMounted || !data.telemetry) return;

          const t = data.telemetry;
          const level =
            t.trafficLevel === "Heavy Traffic"
              ? "Heavy Traffic"
              : t.trafficLevel === "Moderate Traffic"
              ? "Moderate Traffic"
              : "Low Traffic";

          const delay =
            level === "Heavy Traffic"
              ? "8–12 mins (Queue at Barrier)"
              : level === "Moderate Traffic"
              ? "3–5 mins delay"
              : "< 1 min (Clear)";

          const reco =
            level === "Heavy Traffic"
              ? "Heavy vehicle queuing before checkpoint. Slow movement."
              : level === "Moderate Traffic"
              ? "Steady movement at Main Gate barrier arm."
              : "Clear passage. Free flow exiting onto Pune-Solapur Highway access road.";

          setTrafficState((prev) => ({
            ...prev,
            trafficLevel: level,
            dataSource: "LIVE",
            motionActivity: t.motionActivity || "Low",
            pirTriggersPerMin: t.pirTriggersPerMin || 0,
            measuredDistance: t.measuredDistance || "--",
            lastUpdated: "Just now",
            estimatedDelay: delay,
            recommendation: reco,
            isSimulated: false,
            history: data.history || prev.history,
          }));

          setSensorTelemetry((prev) => ({
            ...prev,
            pirStatus: t.pirStatus === "online" ? "online" : "offline",
            pirTriggersPerMin: t.pirTriggersPerMin || 0,
            ultrasonicStatus: t.ultrasonicStatus === "online" ? "online" : "offline",
            ultrasonicDistance: t.measuredDistance || "--",
            rpiNodeStatus: "online",
            rpiHardwareNote: "Raspberry Pi 3B+ (192.168.1.14:8000)",
            dataSource: "LIVE",
            lastSyncTime: "Just now",
          }));
        }
      } catch {
        // Pi is offline or unreachable; leave state as is
      }
    };

    pollLiveTelemetry();
    const interval = setInterval(pollLiveTelemetry, 2500);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [liveStreamActive]);

  // ── On-Demand Immediate Refresh for Dashboard Refresh Icon ──
  const handleRefresh = async () => {
    try {
      let response: Response | null = null;
      try {
        const res = await fetch("/api/pi/telemetry");
        if (res.ok) response = res;
      } catch {}

      if (!response) {
        const fetchPromise = fetch("http://192.168.1.14:8000/telemetry");
        const timeoutPromise = new Promise<Response>((_, reject) =>
          setTimeout(() => reject(new Error("Timeout")), 2500)
        );
        response = (await Promise.race([fetchPromise, timeoutPromise])) as Response;
      }

      if (response && response.ok) {
        const data = await response.json();
        if (data.telemetry) {
          const t = data.telemetry;
          const level =
            t.trafficLevel === "Heavy Traffic"
              ? "Heavy Traffic"
              : t.trafficLevel === "Moderate Traffic"
              ? "Moderate Traffic"
              : "Low Traffic";

          const delay =
            level === "Heavy Traffic"
              ? "8–12 mins (Queue at Barrier)"
              : level === "Moderate Traffic"
              ? "3–5 mins delay"
              : "< 1 min (Clear)";

          const reco =
            level === "Heavy Traffic"
              ? "Heavy vehicle queuing before checkpoint. Slow movement."
              : level === "Moderate Traffic"
              ? "Steady movement at Main Gate barrier arm."
              : "Clear passage. Free flow exiting onto Pune-Solapur Highway access road.";

          setTrafficState((prev) => ({
            ...prev,
            trafficLevel: level,
            dataSource: "LIVE",
            motionActivity: t.motionActivity || "Low",
            pirTriggersPerMin: t.pirTriggersPerMin || 0,
            measuredDistance: t.measuredDistance || "--",
            lastUpdated: "Just now",
            estimatedDelay: delay,
            recommendation: reco,
            isSimulated: false,
            history: data.history || prev.history,
          }));

          setSensorTelemetry((prev) => ({
            ...prev,
            pirStatus: t.pirStatus === "online" ? "online" : "offline",
            pirTriggersPerMin: t.pirTriggersPerMin || 0,
            ultrasonicStatus: t.ultrasonicStatus === "online" ? "online" : "offline",
            ultrasonicDistance: t.measuredDistance || "--",
            rpiNodeStatus: "online",
            rpiHardwareNote: "Raspberry Pi 3B+ (192.168.1.14:8000)",
            dataSource: "LIVE",
            lastSyncTime: "Just now",
          }));
        }
      }
    } catch {
      // Offline fallback
    }
  };

  // Expose simulator for debug mode access
  const handleSimulateState = (preset: "heavy" | "moderate" | "normal" | "offline" | "aws-error" | "live") => {
    if (preset === "live") {
      setLiveStreamActive(true);
      return;
    }

    // Pause automatic polling when manual test presets are clicked
    setLiveStreamActive(false);

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
        recommendation: "AWS MQTT telemetry disconnected. Reconnecting to IoT broker...",
        simulatorPreset: "aws-error",
      }));
    }
  };

  // Make simulator globally accessible for debug panel
  if (typeof window !== "undefined") {
    (window as any).__simulateState = handleSimulateState;
  }

  const navigate = (target: Screen, email?: string) => {
    setScreen(target);
    if (target === "dashboard" && email) {
      const cleanEmail = email.trim();
      const newSession: UserSession = {
        type: "signed-in",
        email: cleanEmail,
        isVerified: true,
        displayName: cleanEmail
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        joinedAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      authService.saveActiveSession(newSession);
      setUserSession(newSession);
    }
  };

  const handleGuestLogin = () => {
    const guest = authService.createGuestSession();
    setUserSession(guest);
    setScreen("dashboard");
  };

  const handleLoginSuccess = (session: UserSession) => {
    authService.saveActiveSession(session);
    setUserSession(session);
    setScreen("dashboard");
  };

  const handleSignUp = (
    email: string,
    role: UserRole,
    session?: UserSession
  ) => {
    if (session) {
      authService.saveActiveSession(session);
      setUserSession(session);
    } else {
      const cleanEmail = email.trim();
      const newSession: UserSession = {
        type: "signed-in",
        email: cleanEmail,
        role,
        isVerified: true,
        displayName: cleanEmail
          .split("@")[0]
          .replace(/[._]/g, " ")
          .replace(/\b\w/g, (c) => c.toUpperCase()),
        joinedAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
      };
      authService.saveActiveSession(newSession);
      setUserSession(newSession);
    }
    setScreen("dashboard");
  };

  const handleSignOut = () => {
    authService.clearActiveSession();
    setUserSession({
      type: "guest",
      displayName: "Guest Commuter",
      joinedAt: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }),
    });
    setScreen("login");
  };

  const handleUpdateNotifications = (settings: Partial<NotificationSettings>) => {
    setNotificationSettings((prev) => ({
      ...prev,
      ...settings,
    }));
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
        {/* Launch Splash Screen */}
        {showSplash && (
          <SplashScreen onFinish={() => setShowSplash(false)} durationMs={1800} />
        )}

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
              onGuestLogin={handleGuestLogin}
              onLoginSuccess={handleLoginSuccess}
            />
          )}

          {screen === "signup" && (
            <SignUpScreen
              navigate={navigate}
              onSignUp={handleSignUp}
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
              onRefresh={handleRefresh}
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

          {screen === "profile" && (
            <ProfileScreen
              navigate={navigate}
              systemInfo={systemInfo}
              trafficState={trafficState}
              sensorTelemetry={sensorTelemetry}
              notificationSettings={notificationSettings}
              onUpdateNotifications={handleUpdateNotifications}
              userSession={userSession}
              onSignOut={handleSignOut}
              onUpdateSession={(updated) => setUserSession(updated)}
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
