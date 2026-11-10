import { useState } from "react";
import {
  ArrowLeft,
  Edit3,
  Check,
  X,
  Shield,
  Mail,
  Calendar,
  Building,
  LogOut,
  Map,
  BarChart2,
  Bell,
  Home,
  User,
  Radio,
} from "lucide-react";
import {
  Screen,
  TrafficState,
  UniversitySystemInfo,
  NotificationSettings,
  UserSession,
  SensorTelemetry,
} from "../../types";
import { authService } from "../../services/authService";
import { BottomNavBar } from "../BottomNavBar";

interface ProfileScreenProps {
  navigate: (screen: Screen) => void;
  systemInfo?: UniversitySystemInfo;
  trafficState: TrafficState;
  sensorTelemetry: SensorTelemetry;
  notificationSettings: NotificationSettings;
  onUpdateNotifications: (settings: Partial<NotificationSettings>) => void;
  userSession: UserSession;
  onSignOut?: () => void;
  onUpdateSession?: (updated: UserSession) => void;
}

/* ── Avatar initials generator ── */
function getInitials(session: UserSession): string {
  if (session.type === "guest") return "G";
  if (session.displayName) {
    const parts = session.displayName.trim().split(" ");
    return parts.length >= 2
      ? (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
      : parts[0].slice(0, 2).toUpperCase();
  }
  return session.email ? session.email[0].toUpperCase() : "U";
}

/* ── Clean Info Row ── */
function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2.5 border-b border-slate-100 last:border-b-0 text-xs">
      <span className="text-slate-500 font-medium">{label}</span>
      <span className="font-semibold text-slate-900 text-right max-w-[60%] truncate">
        {value}
      </span>
    </div>
  );
}

export function ProfileScreen({
  navigate,
  userSession,
  onSignOut,
  onUpdateSession,
}: ProfileScreenProps) {
  const isGuest = userSession.type === "guest";
  const initials = getInitials(userSession);
  const displayName = userSession.displayName ?? (isGuest ? "Guest Visitor" : "Member");
  const subTitle = isGuest
    ? "Guest Session"
    : userSession.role
    ? `${userSession.role} • ${userSession.email ?? ""}`
    : userSession.email ?? "";

  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(displayName);

  const handleSaveName = () => {
    const trimmed = editedName.trim();
    if (!trimmed) return;
    const updated: UserSession = {
      ...userSession,
      displayName: trimmed,
    };
    authService.saveActiveSession(updated);
    if (onUpdateSession) {
      onUpdateSession(updated);
    }
    if (userSession.email) {
      try {
        const users = authService.getAllUsers();
        const u = users.find((x) => x.email.toLowerCase() === userSession.email!.toLowerCase());
        if (u) {
          u.displayName = trimmed;
          localStorage.setItem("traffiq_users_db", JSON.stringify(users));
        }
      } catch (e) {
        console.warn("Could not update user record", e);
      }
    }
    setIsEditingName(false);
  };

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
              User Profile
            </h1>
            <p className="text-[10.5px] text-slate-500 font-medium">
              MIT-ADT University Campus Transit
            </p>
          </div>
        </div>
      </header>

      {/* ── Scrollable Body ── */}
      <main className="flex-1 overflow-y-auto px-4 py-4 space-y-3" style={{ scrollbarWidth: "none" }}>
        {/* ── Avatar Hero Card ── */}
        <section aria-label="Account overview" className="bg-white rounded-2xl border border-slate-200/80 shadow-xs p-5 flex flex-col items-center text-center">
          {/* Avatar Circle */}
          <div className="w-16 h-16 rounded-full bg-[#4B168C] text-white flex items-center justify-center text-xl font-bold border-2 border-slate-100 shadow-xs">
            {initials}
          </div>

          <div className="mt-3 w-full max-w-xs">
            {isEditingName ? (
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <input
                  type="text"
                  value={editedName}
                  onChange={(e) => setEditedName(e.target.value)}
                  className="bg-slate-50 border border-purple-300 rounded-lg text-slate-900 text-sm font-semibold px-2.5 py-1 text-center w-44 focus:ring-2 focus:ring-[#4B168C] outline-none"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSaveName();
                    if (e.key === "Escape") setIsEditingName(false);
                  }}
                />
                <button
                  type="button"
                  onClick={handleSaveName}
                  className="bg-[#4B168C] text-white p-1.5 rounded-md hover:bg-[#3B1170] transition-colors"
                  aria-label="Save name"
                >
                  <Check size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setIsEditingName(false)}
                  className="bg-slate-200 text-slate-700 p-1.5 rounded-md hover:bg-slate-300 transition-colors"
                  aria-label="Cancel editing"
                >
                  <X size={14} />
                </button>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-1.5 mt-1">
                <h2 className="text-[17px] font-bold text-slate-900 tracking-tight">
                  {displayName}
                </h2>
                {!isGuest && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditedName(displayName);
                      setIsEditingName(true);
                    }}
                    title="Edit display name"
                    className="text-slate-400 hover:text-slate-700 p-1"
                  >
                    <Edit3 size={13} />
                  </button>
                )}
              </div>
            )}
            <p className="text-xs text-slate-500 font-medium mt-0.5 truncate">
              {subTitle}
            </p>
          </div>

          {/* Access Role Badge */}
          <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full border border-purple-200 bg-purple-50 text-[11px] font-semibold text-[#4B168C]">
            <Shield size={12} />
            <span>{isGuest ? "Guest Access" : userSession.role ?? "Verified Member"}</span>
          </div>
        </section>

        {/* ── Account Details Card ── */}
        <section aria-label="Session details" className="bg-white rounded-xl border border-slate-200/80 shadow-xs p-4 space-y-1">
          <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Session Details
          </p>
          <InfoRow label="Access Type" value={isGuest ? "Guest" : "Registered User"} />
          {!isGuest && userSession.role && (
            <InfoRow label="Campus Role" value={userSession.role} />
          )}
          <InfoRow label="Session Started" value={userSession.joinedAt} />
          {!isGuest && userSession.email && (
            <InfoRow label="Email Account" value={userSession.email} />
          )}
          <InfoRow label="Monitored Gate" value="Main Campus Gate (NH 65)" />
          <InfoRow label="Campus" value="MIT-ADT University, Pune" />
          <div className="flex items-center justify-between py-2.5 text-xs">
            <span className="text-slate-500 font-medium">App Release</span>
            <span className="px-2 py-0.5 rounded-md text-[11px] font-semibold bg-slate-100 text-slate-700">
              TraffiQ v1.2
            </span>
          </div>
        </section>

        {/* ── Quick Navigation Links ── */}
        <section aria-label="Quick links" className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <div className="px-4 py-2.5 border-b border-slate-100">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Navigation
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            <button
              type="button"
              onClick={() => navigate("dashboard")}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Home size={16} className="text-slate-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Home Dashboard</p>
                  <p className="text-[10.5px] text-slate-500">Main traffic overview</p>
                </div>
              </div>
              <span className="text-slate-300 text-sm">›</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("live-map")}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Map size={16} className="text-slate-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Live Campus Map</p>
                  <p className="text-[10.5px] text-slate-500">Real-time gate approach</p>
                </div>
              </div>
              <span className="text-slate-300 text-sm">›</span>
            </button>

            <button
              type="button"
              onClick={() => navigate("analytics")}
              className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-slate-50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <BarChart2 size={16} className="text-slate-500" />
                <div>
                  <p className="text-xs font-semibold text-slate-800">Gate Analytics</p>
                  <p className="text-[10.5px] text-slate-500">Exit delays & clearance curves</p>
                </div>
              </div>
              <span className="text-slate-300 text-sm">›</span>
            </button>
          </div>
        </section>

        {/* ── Session Action (Sign Out) ── */}
        <section className="bg-white rounded-xl border border-slate-200/80 shadow-xs overflow-hidden">
          <button
            type="button"
            onClick={() => {
              if (onSignOut) {
                onSignOut();
              } else {
                authService.clearActiveSession();
                navigate("login");
              }
            }}
            className="w-full flex items-center gap-3 px-4 py-3 text-left text-rose-700 hover:bg-rose-50/50 transition-colors"
          >
            <LogOut size={16} />
            <div>
              <p className="text-xs font-semibold">
                {isGuest ? "Return to Sign In" : "Sign Out of Account"}
              </p>
              <p className="text-[10.5px] text-slate-500">
                {isGuest ? "Access registered campus roles" : "End session & clear credentials"}
              </p>
            </div>
          </button>
        </section>
      </main>

      {/* ── Unified Bottom Navigation Bar ── */}
      <BottomNavBar currentScreen="profile" navigate={navigate} />
    </div>
  );
}
