import { useState, useId } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User } from "lucide-react";
import { Screen, UserSession } from "../../types";
import { authService } from "../../services/authService";

interface LoginScreenProps {
  navigate: (screen: Screen, email?: string) => void;
  onGuestLogin?: () => void;
  onLoginSuccess?: (session: UserSession) => void;
}

function TraffiQAppIcon() {
  return (
    <div
      style={{
        width: "54px",
        height: "54px",
        borderRadius: "16px",
        background: "linear-gradient(145deg, #1C0C3A 0%, #290E52 100%)",
        border: "1.5px solid rgba(214, 165, 42, 0.75)",
        boxShadow: "0 6px 20px rgba(41, 14, 82, 0.4)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      <svg width="30" height="30" viewBox="0 0 30 30" fill="none">
        {/* Sensor radio wave arc */}
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

export function LoginScreen({ navigate, onGuestLogin, onLoginSuccess }: LoginScreenProps) {
  const emailId = useId();
  const passwordId = useId();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleEnterDashboard = () => {
    if (onGuestLogin) {
      onGuestLogin();
    } else {
      navigate("dashboard");
    }
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid email address.");
      return;
    }

    if (!password) {
      setErrorMessage("Please enter your password.");
      return;
    }

    setLoading(true);

    setTimeout(() => {
      // Authenticate against authService local database
      const result = authService.loginUser(cleanEmail, password);
      setLoading(false);

      if (!result.success || !result.session) {
        setErrorMessage(result.error || "Login failed. Please check credentials.");
        return;
      }

      // Successful login -> trigger callback with persistent session
      if (onLoginSuccess) {
        onLoginSuccess(result.session);
      } else {
        navigate("dashboard", cleanEmail);
      }
    }, 450);
  };

  return (
    <div className="flex flex-col h-full w-full bg-brand-lavender overflow-hidden">
      {/* ── TOP CAMPUS PHOTO — fills ~40% of screen height ── */}
      <div
        className="relative w-full flex-shrink-0"
        style={{ height: "40%", minHeight: "190px", maxHeight: "260px" }}
      >
        <img
          src="/mit_adt_dome_real.jpg"
          alt="MIT-ADT University World Peace Dome, Rajbaug Campus, Pune"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center 20%",
            display: "block",
          }}
        />
        {/* Bottom fade into white card */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0) 50%, rgba(243,239,248,0.55) 80%, #F3EFF8 100%)",
          }}
        />
      </div>

      {/* ── WHITE CARD — sits below the photo ── */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{
          background: "#FFFFFF",
          borderTopLeftRadius: "28px",
          borderTopRightRadius: "28px",
          boxShadow: "0 -4px 24px rgba(41, 14, 82, 0.10)",
          paddingBottom: "18px",
          scrollbarWidth: "none",
        }}
      >
        {/* Icon + Branding — pinned at top of card */}
        <div
          className="flex flex-col items-center text-center"
          style={{ paddingTop: "18px", paddingBottom: "6px" }}
        >
          <TraffiQAppIcon />

          <div
            className="flex items-baseline justify-center gap-0.5"
            style={{ marginTop: "8px" }}
            aria-label="TRAFFIQ"
          >
            <span
              style={{
                fontSize: "26px",
                fontWeight: 900,
                letterSpacing: "-0.5px",
                color: "#17172F",
              }}
            >
              Traffi
            </span>
            <span
              style={{
                fontSize: "26px",
                fontWeight: 900,
                letterSpacing: "-0.5px",
                color: "#D6A52A",
              }}
            >
              Q
            </span>
          </div>

          <p
            style={{
              fontSize: "10.5px",
              color: "#4B168C",
              fontWeight: 700,
              letterSpacing: "0.05em",
              textTransform: "uppercase",
              marginTop: "1px",
              marginBottom: "1px",
            }}
          >
            MIT-ADT UNIVERSITY • RAJBAUG CAMPUS
          </p>

          <p
            style={{
              fontSize: "11px",
              color: "#6B6B80",
              fontWeight: 500,
              margin: 0,
            }}
          >
            Smart Traffic & Main Gate Commute System
          </p>
        </div>

        {/* Error Alert */}
        {errorMessage && (
          <div
            style={{
              margin: "4px 20px 2px",
              padding: "10px 14px",
              background: "#FEE2E2",
              border: "1px solid #FCA5A5",
              borderRadius: "12px",
              color: "#B91C1C",
              fontSize: "12px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <span>⚠️</span>
            <span>{errorMessage}</span>
          </div>
        )}

        {/* ── Form ── */}
        <form
          onSubmit={handleLoginSubmit}
          className="flex flex-col"
          style={{ padding: "0 20px", gap: "12px", marginTop: "8px" }}
        >
          {/* EMAIL */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label
                htmlFor={emailId}
                style={{
                  fontSize: "10.5px",
                  fontWeight: 800,
                  color: "#17172F",
                  letterSpacing: "0.04em",
                }}
              >
                EMAIL ADDRESS
              </label>
            </div>
            <div
              className="flex items-center w-full rounded-xl px-3"
              style={{
                height: "46px",
                background: "#F7F4FB",
                border: "1.5px solid #EADBFA",
              }}
            >
              <Mail size={15} color="#6B6B80" style={{ flexShrink: 0, marginRight: "10px" }} />
              <input
                id={emailId}
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "13px",
                  color: "#17172F",
                }}
              />
            </div>
          </div>

          {/* PASSWORD */}
          <div>
            <div className="flex items-center justify-between" style={{ marginBottom: "5px" }}>
              <label
                htmlFor={passwordId}
                style={{
                  fontSize: "10.5px",
                  fontWeight: 800,
                  color: "#17172F",
                  letterSpacing: "0.04em",
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
                  padding: 0,
                }}
              >
                Forgot?
              </button>
            </div>

            <div
              className="flex items-center w-full rounded-xl px-3"
              style={{
                height: "46px",
                background: "#F7F4FB",
                border: "1.5px solid #EADBFA",
              }}
            >
              <Lock size={15} color="#6B6B80" style={{ flexShrink: 0, marginRight: "10px" }} />
              <input
                id={passwordId}
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                style={{
                  flex: 1,
                  background: "transparent",
                  border: "none",
                  outline: "none",
                  fontSize: "13px",
                  color: "#17172F",
                }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                  color: "#6B6B80",
                  padding: "4px",
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                }}
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <Eye size={15} /> : <EyeOff size={15} />}
              </button>
            </div>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={loading}
            style={{
              height: "48px",
              borderRadius: "14px",
              background: "linear-gradient(135deg, #370E68 0%, #200540 100%)",
              boxShadow: "0 6px 18px rgba(45, 12, 85, 0.35)",
              border: "none",
              color: "#FFFFFF",
              fontSize: "14.5px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
              marginTop: "2px",
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
          >
            {loading ? (
              <Spinner />
            ) : (
              <>
                <span>Sign In</span>
                <ArrowRight size={16} />
              </>
            )}
          </button>
        </form>

        {/* New User Sign Up link */}
        <p style={{ textAlign: "center", margin: "10px 20px 0", fontSize: "12px", color: "#6B6B80" }}>
          New user?{" "}
          <button
            type="button"
            style={{
              background: "none",
              border: "none",
              padding: 0,
              fontSize: "12px",
              fontWeight: 700,
              color: "#4B168C",
              cursor: "pointer",
              textDecoration: "underline",
            }}
            onClick={() => navigate("signup")}
          >
            Register with Email OTP
          </button>
        </p>

        {/* Divider */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "12px",
            margin: "12px 20px 10px",
          }}
        >
          <div style={{ flex: 1, height: "1px", background: "#EADBFA" }} />
          <span
            style={{
              fontSize: "10px",
              color: "#8E8EA0",
              fontWeight: 700,
              letterSpacing: "0.05em",
            }}
          >
            OR
          </span>
          <div style={{ flex: 1, height: "1px", background: "#EADBFA" }} />
        </div>

        {/* Continue as Guest */}
        <div style={{ padding: "0 20px" }}>
          <button
            type="button"
            onClick={handleEnterDashboard}
            style={{
              width: "100%",
              height: "44px",
              borderRadius: "14px",
              background: "#FFFFFF",
              border: "1.5px solid #4B168C",
              color: "#4B168C",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "8px",
            }}
            aria-label="Continue as Guest to Main Campus Gate Dashboard"
          >
            <User size={16} color="#4B168C" />
            <span>Continue as Guest</span>
          </button>
          <p
            style={{
              fontSize: "10px",
              color: "#6B6B80",
              textAlign: "center",
              lineHeight: 1.4,
              marginTop: "5px",
            }}
          >
            Instant access to Main Campus Gate live flow without saving credentials.
          </p>
        </div>
      </div>
    </div>
  );
}
