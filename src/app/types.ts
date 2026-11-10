export type Screen =
  | "login"
  | "signup"
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

export interface HistoricalRecord {
  time: string;
  displayTime: string;
  timestamp: string;
  distance: number;
  u1Distance?: number;
  u2Distance?: number;
  trafficLevel: TrafficLevel;
  delayMins: number;
  flow: string;
  pirTriggers: number;
  motionActivity: MotionActivityLevel;
}

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
  simulatorPreset: "heavy" | "moderate" | "normal" | "offline" | "aws-error" | "live";
  history?: HistoricalRecord[];
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

export type UserRole =
  | "Student"
  | "Staff"
  | "Non-Teaching Staff"
  | "Visitor"
  | "Campus Security"
  | "Admin";

export interface UserSession {
  type: "guest" | "signed-in";
  email?: string; // only when signed-in
  displayName?: string; // derived from email or set manually
  role?: UserRole; // only when signed-in
  token?: string; // JWT token simulation
  isVerified?: boolean; // Email OTP verified
  joinedAt: string; // e.g. "Just now"
}

