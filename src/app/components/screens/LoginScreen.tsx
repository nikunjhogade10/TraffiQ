import { useState, useId } from "react";
import { Mail, Lock, Eye, EyeOff, ArrowRight, User, ShieldCheck, KeyRound, CheckCircle2, GraduationCap, Briefcase, Building2 } from "lucide-react";
import { Screen, UserRole, UserSession } from "../../types";
import { authService } from "../../services/authService";
import { emailService } from "../../services/emailService";

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
  const otpId = useId();

  const [loginMode, setLoginMode] = useState<"password" | "otp">("otp");
  const [selectedRole, setSelectedRole] = useState<UserRole>("Student");
  const [email, setEmail] = useState("student@mitadt.edu.in");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successBanner, setSuccessBanner] = useState<string | null>(null);
  const [otpStep, setOtpStep] = useState<"request" | "verify">("request");
  const [otpCode, setOtpCode] = useState("");
  const [resendCountdown, setResendCountdown] = useState(0);

  const QUICK_ROLES: { id: UserRole; label: string; email: string; icon: React.ReactNode }[] = [
    {
      id: "Student",
      label: "Student",
      email: "student@mitadt.edu.in",
      icon: <GraduationCap size={15} />,
    },
    {
      id: "Staff",
      label: "Teaching Staff",
      email: "staff@mitadt.edu.in",
      icon: <Briefcase size={15} />,
    },
    {
      id: "Non-Teaching Staff",
      label: "Non-Teaching Staff",
      email: "nonteaching@mitadt.edu.in",
      icon: <Building2 size={15} />,
    },
  ];

  const handleSelectRole = (r: { id: UserRole; email: string }) => {
    setSelectedRole(r.id);
    setEmail(r.email);
    setOtpStep("request");
    setOtpCode("");
    setErrorMessage(null);
    setSuccessBanner(null);
  };

  const handleSendOtp = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMessage(null);
    setSuccessBanner(null);

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !cleanEmail.includes("@")) {
      setErrorMessage("Please enter a valid institutional email address.");
      return;
    }

    setLoading(true);
    const code = authService.generateOtp(cleanEmail);
    setResendCountdown(60);

    try {
      const res = await emailService.sendVerificationOtp(
        cleanEmail,
        code,
        "LOGIN",
        selectedRole
      );
      if (res.realEmailSent) {
        setSuccessBanner(`Real 6-digit OTP sent to ${cleanEmail}. Check your inbox!`);
      } else {
        setSuccessBanner(`Verification code ready for ${cleanEmail}`);
      }
    } catch {
      setSuccessBanner(`Verification code ready for ${cleanEmail}`);
    } finally {
      setLoading(false);
      setOtpStep("verify");
    }
  };

  const handleVerifyOtpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otpCode.trim();

    if (cleanOtp.length !== 6) {
      setErrorMessage("Please enter all 6 digits of the OTP verification code.");
      return;
    }

    setLoading(true);
    setTimeout(() => {
      const result = authService.loginWithOtp(cleanEmail, cleanOtp, selectedRole);
      setLoading(false);

      if (!result.success || !result.session) {
        setErrorMessage(result.error || "Verification failed. Incorrect or expired code.");
        return;
      }

      if (onLoginSuccess) {
        onLoginSuccess(result.session);
      } else {
        navigate("dashboard", cleanEmail);
      }
    }, 450);
  };

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
      const result = authService.loginUser(cleanEmail, password);
      setLoading(false);

      if (!result.success || !result.session) {
        setErrorMessage(result.error || "Login failed. Please check credentials.");
        return;
      }

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

        {/* Success Banner */}
        {successBanner && !errorMessage && (
          <div
            style={{
              margin: "4px 20px 2px",
              padding: "9px 12px",
              background: "#ECFDF5",
              border: "1px solid #A7F3D0",
              borderRadius: "12px",
              color: "#065F46",
              fontSize: "11.5px",
              fontWeight: 600,
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            <CheckCircle2 size={16} color="#059669" />
            <span>{successBanner}</span>
          </div>
        )}

        {/* ── SEGMENTED AUTH MODE SWITCHER ── */}
        <div style={{ padding: "0 20px", marginTop: "10px" }}>
          <div
            style={{
              display: "flex",
              background: "#F3EFF8",
              borderRadius: "12px",
              padding: "3px",
              gap: "3px",
              border: "1px solid #EADBFA",
            }}
          >
            <button
              type="button"
              onClick={() => {
                setLoginMode("otp");
                setErrorMessage(null);
                setSuccessBanner(null);
              }}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: "9px",
                border: "none",
                fontSize: "11.5px",
                fontWeight: 700,
                cursor: "pointer",
                background: loginMode === "otp" ? "#FFFFFF" : "transparent",
                color: loginMode === "otp" ? "#4B168C" : "#6B6B80",
                boxShadow: loginMode === "otp" ? "0 2px 6px rgba(41, 14, 82, 0.12)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                transition: "all 0.15s ease",
              }}
            >
              <ShieldCheck size={14} color={loginMode === "otp" ? "#4B168C" : "#6B6B80"} />
              <span>Email OTP Login</span>
            </button>

            <button
              type="button"
              onClick={() => {
                setLoginMode("password");
                setErrorMessage(null);
                setSuccessBanner(null);
              }}
              style={{
                flex: 1,
                padding: "8px 0",
                borderRadius: "9px",
                border: "none",
                fontSize: "11.5px",
                fontWeight: 700,
                cursor: "pointer",
                background: loginMode === "password" ? "#FFFFFF" : "transparent",
                color: loginMode === "password" ? "#4B168C" : "#6B6B80",
                boxShadow: loginMode === "password" ? "0 2px 6px rgba(41, 14, 82, 0.12)" : "none",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "5px",
                transition: "all 0.15s ease",
              }}
            >
              <KeyRound size={13} color={loginMode === "password" ? "#4B168C" : "#6B6B80"} />
              <span>Password Login</span>
            </button>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════
            MODE A: EMAIL OTP LOGIN (Student, Staff, Non-Teaching)
            ═══════════════════════════════════════════════ */}
        {loginMode === "otp" && (
          <div style={{ padding: "0 20px", marginTop: "10px", display: "flex", flexDirection: "column", gap: "10px" }}>
            {/* Quick Role Selection Chips */}
            <div>
              <label
                style={{
                  fontSize: "10px",
                  fontWeight: 800,
                  color: "#17172F",
                  display: "block",
                  marginBottom: "5px",
                  letterSpacing: "0.04em",
                }}
              >
                SELECT INSTITUTIONAL ROLE FOR OTP
              </label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "5px" }}>
                {QUICK_ROLES.map((r) => {
                  const isSelected = selectedRole === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      onClick={() => handleSelectRole(r)}
                      style={{
                        padding: "7px 4px",
                        borderRadius: "10px",
                        background: isSelected ? "#4B168C" : "#F7F4FB",
                        color: isSelected ? "#FFFFFF" : "#17172F",
                        border: isSelected ? "1.5px solid #D6A52A" : "1.5px solid #EADBFA",
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        gap: "3px",
                        transition: "all 0.15s ease",
                      }}
                    >
                      <div style={{ color: isSelected ? "#F3D37A" : "#4B168C" }}>{r.icon}</div>
                      <span style={{ fontSize: "10px", fontWeight: 700, textAlign: "center", lineHeight: 1.1 }}>
                        {r.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* OTP Step 1: Email Input & Request Button */}
            {otpStep === "request" && (
              <form onSubmit={handleSendOtp} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <label
                    htmlFor={emailId}
                    style={{
                      fontSize: "10px",
                      fontWeight: 800,
                      color: "#17172F",
                      letterSpacing: "0.04em",
                      display: "block",
                      marginBottom: "4px",
                    }}
                  >
                    INSTITUTIONAL EMAIL ({selectedRole.toUpperCase()})
                  </label>
                  <div
                    className="flex items-center w-full rounded-xl px-3"
                    style={{
                      height: "44px",
                      background: "#F7F4FB",
                      border: "1.5px solid #EADBFA",
                    }}
                  >
                    <Mail size={15} color="#6B6B80" style={{ flexShrink: 0, marginRight: "8px" }} />
                    <input
                      id={emailId}
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@mitadt.edu.in"
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

                <button
                  type="submit"
                  disabled={loading}
                  style={{
                    height: "46px",
                    borderRadius: "12px",
                    background: "linear-gradient(135deg, #370E68 0%, #200540 100%)",
                    boxShadow: "0 4px 14px rgba(45, 12, 85, 0.3)",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "4px",
                  }}
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      <span>Send 6-Digit OTP</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* OTP Step 2: Code Verification */}
            {otpStep === "verify" && (
              <form onSubmit={handleVerifyOtpSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                    <label
                      htmlFor={otpId}
                      style={{
                        fontSize: "10px",
                        fontWeight: 800,
                        color: "#17172F",
                        letterSpacing: "0.04em",
                      }}
                    >
                      ENTER 6-DIGIT SECURITY CODE
                    </label>
                    <button
                      type="button"
                      onClick={() => setOtpStep("request")}
                      style={{
                        background: "none",
                        border: "none",
                        color: "#4B168C",
                        fontSize: "10.5px",
                        fontWeight: 700,
                        cursor: "pointer",
                        padding: 0,
                      }}
                    >
                      Change email
                    </button>
                  </div>

                  <div
                    className="flex items-center w-full rounded-xl px-3"
                    style={{
                      height: "46px",
                      background: "#F7F4FB",
                      border: "1.5px solid #C084FC",
                    }}
                  >
                    <ShieldCheck size={16} color="#7C3AED" style={{ flexShrink: 0, marginRight: "8px" }} />
                    <input
                      id={otpId}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={6}
                      autoFocus
                      required
                      value={otpCode}
                      onChange={(e) => setOtpCode(e.target.value.replace(/[^0-9]/g, "").slice(0, 6))}
                      placeholder="• • • • • •"
                      style={{
                        flex: 1,
                        background: "transparent",
                        border: "none",
                        outline: "none",
                        fontSize: "18px",
                        fontWeight: 800,
                        letterSpacing: "6px",
                        color: "#4B168C",
                        textAlign: "center",
                      }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "11px" }}>
                  <span style={{ color: "#6B6B80" }}>
                    Sent to: <strong style={{ color: "#17172F" }}>{email}</strong>
                  </span>
                  <button
                    type="button"
                    onClick={() => handleSendOtp()}
                    disabled={resendCountdown > 0 || loading}
                    style={{
                      background: "none",
                      border: "none",
                      color: resendCountdown > 0 ? "#94A3B8" : "#4B168C",
                      fontWeight: 700,
                      cursor: resendCountdown > 0 ? "default" : "pointer",
                      padding: 0,
                    }}
                  >
                    {resendCountdown > 0 ? `Resend (${resendCountdown}s)` : "Resend Code"}
                  </button>
                </div>

                <button
                  type="submit"
                  disabled={loading || otpCode.length !== 6}
                  style={{
                    height: "46px",
                    borderRadius: "12px",
                    background: otpCode.length === 6 ? "linear-gradient(135deg, #370E68 0%, #200540 100%)" : "#CBD5E1",
                    boxShadow: otpCode.length === 6 ? "0 4px 14px rgba(45, 12, 85, 0.3)" : "none",
                    border: "none",
                    color: "#FFFFFF",
                    fontSize: "13.5px",
                    fontWeight: 700,
                    cursor: otpCode.length === 6 ? "pointer" : "not-allowed",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "8px",
                    marginTop: "2px",
                  }}
                >
                  {loading ? (
                    <Spinner />
                  ) : (
                    <>
                      <span>Verify & Enter Dashboard</span>
                      <ArrowRight size={15} />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        )}

        {/* ═══════════════════════════════════════════════
            MODE B: PASSWORD LOGIN
            ═══════════════════════════════════════════════ */}
        {loginMode === "password" && (
          <form
            onSubmit={handleLoginSubmit}
            className="flex flex-col"
            style={{ padding: "0 20px", gap: "10px", marginTop: "10px" }}
          >
            {/* EMAIL */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label
                  htmlFor={emailId}
                  style={{
                    fontSize: "10px",
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
                  height: "44px",
                  background: "#F7F4FB",
                  border: "1.5px solid #EADBFA",
                }}
              >
                <Mail size={15} color="#6B6B80" style={{ flexShrink: 0, marginRight: "8px" }} />
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
              <div className="flex items-center justify-between" style={{ marginBottom: "4px" }}>
                <label
                  htmlFor={passwordId}
                  style={{
                    fontSize: "10px",
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
                    fontSize: "10.5px",
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
                  height: "44px",
                  background: "#F7F4FB",
                  border: "1.5px solid #EADBFA",
                }}
              >
                <Lock size={15} color="#6B6B80" style={{ flexShrink: 0, marginRight: "8px" }} />
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
                height: "46px",
                borderRadius: "12px",
                background: "linear-gradient(135deg, #370E68 0%, #200540 100%)",
                boxShadow: "0 4px 14px rgba(45, 12, 85, 0.3)",
                border: "none",
                color: "#FFFFFF",
                fontSize: "13.5px",
                fontWeight: 700,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "8px",
                marginTop: "2px",
              }}
            >
              {loading ? (
                <Spinner />
              ) : (
                <>
                  <span>Sign In</span>
                  <ArrowRight size={15} />
                </>
              )}
            </button>
          </form>
        )}

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
