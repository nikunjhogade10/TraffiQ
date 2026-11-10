import { UserRole, UserSession } from "../types";

export interface RegisteredUser {
  id: string;
  email: string;
  passwordHash: string; // Base64 / hashed in production
  displayName: string;
  role: UserRole;
  isVerified: boolean;
  createdAt: string;
}

interface StoredOtp {
  email: string;
  otp: string;
  expiresAt: number; // epoch ms
}

const USERS_STORAGE_KEY = "traffiq_users_db";
const SESSION_STORAGE_KEY = "traffiq_auth_session";
const OTP_STORAGE_KEY = "traffiq_pending_otps";

// Seed accounts for instant evaluation & testing
const SEED_USERS: RegisteredUser[] = [
  {
    id: "usr_student_01",
    email: "student@mitadt.edu.in",
    passwordHash: "Pass@123",
    displayName: "Aryan Sharma",
    role: "Student",
    isVerified: true,
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "usr_staff_01",
    email: "staff@mitadt.edu.in",
    passwordHash: "Staff@123",
    displayName: "Dr. Sandeep Kulkarni (Faculty)",
    role: "Staff",
    isVerified: true,
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "usr_nonteaching_01",
    email: "nonteaching@mitadt.edu.in",
    passwordHash: "Staff@123",
    displayName: "Sunil Shinde (Administration & Operations)",
    role: "Non-Teaching Staff",
    isVerified: true,
    createdAt: "2026-11-01T10:00:00Z",
  },
  {
    id: "usr_security_01",
    email: "security@mitadt.edu.in",
    passwordHash: "Gate@123",
    displayName: "Ramesh Pawar (Gate Supervisor)",
    role: "Campus Security",
    isVerified: true,
    createdAt: "2026-11-01T10:00:00Z",
  },
];

class AuthService {
  constructor() {
    this.initDatabase();
  }

  /**
   * Initializes local user database with seed accounts if empty.
   */
  private initDatabase(): void {
    if (typeof window === "undefined") return;
    try {
      const existing = localStorage.getItem(USERS_STORAGE_KEY);
      if (!existing) {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(SEED_USERS));
      } else {
        const parsed: RegisteredUser[] = JSON.parse(existing);
        let updated = false;
        for (const seed of SEED_USERS) {
          if (!parsed.some((u) => u.email.toLowerCase() === seed.email.toLowerCase())) {
            parsed.push(seed);
            updated = true;
          }
        }
        if (updated) {
          localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(parsed));
        }
      }
    } catch (err) {
      console.warn("Could not access localStorage for user database", err);
    }
  }

  /**
   * Fetch all registered users from database.
   */
  public getAllUsers(): RegisteredUser[] {
    if (typeof window === "undefined") return SEED_USERS;
    try {
      const data = localStorage.getItem(USERS_STORAGE_KEY);
      return data ? JSON.parse(data) : SEED_USERS;
    } catch {
      return SEED_USERS;
    }
  }

  /**
   * Find a user by email (case-insensitive).
   */
  public findUserByEmail(email: string): RegisteredUser | undefined {
    const clean = email.trim().toLowerCase();
    const users = this.getAllUsers();
    return users.find((u) => u.email.toLowerCase() === clean);
  }

  /**
   * Generate and store a 6-digit OTP code with a 5-minute expiry.
   * Returns the generated code for UI simulation & dispatch.
   */
  public generateOtp(email: string): string {
    const clean = email.trim().toLowerCase();
    // Generate secure-looking 6-digit numeric OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const otpRecord: StoredOtp = {
      email: clean,
      otp: code,
      expiresAt: Date.now() + 5 * 60 * 1000, // 5 minutes validity
    };

    try {
      const currentOtps: StoredOtp[] = JSON.parse(
        localStorage.getItem(OTP_STORAGE_KEY) || "[]"
      );
      // Remove any prior OTP for this email
      const filtered = currentOtps.filter((o) => o.email !== clean);
      filtered.push(otpRecord);
      localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(filtered));
    } catch (err) {
      console.warn("Error storing OTP", err);
    }

    return code;
  }

  /**
   * Verify entered OTP against stored record.
   */
  public verifyOtp(
    email: string,
    enteredOtp: string
  ): { success: boolean; error?: string } {
    const clean = email.trim().toLowerCase();
    const entered = enteredOtp.trim();

    try {
      const currentOtps: StoredOtp[] = JSON.parse(
        localStorage.getItem(OTP_STORAGE_KEY) || "[]"
      );
      const match = currentOtps.find((o) => o.email === clean);

      if (!match) {
        return {
          success: false,
          error: "No active verification code found. Please request a new OTP.",
        };
      }

      if (Date.now() > match.expiresAt) {
        return {
          success: false,
          error: "Verification code has expired. Please request a new one.",
        };
      }

      if (match.otp !== entered) {
        return {
          success: false,
          error: "Incorrect 6-digit code. Please check and try again.",
        };
      }

      // Valid OTP: Clean up used OTP
      const updated = currentOtps.filter((o) => o.email !== clean);
      localStorage.setItem(OTP_STORAGE_KEY, JSON.stringify(updated));

      return { success: true };
    } catch (err) {
      return { success: false, error: "Verification system error. Please retry." };
    }
  }

  /**
   * Register a new user and persist into database.
   */
  public registerUser(params: {
    email: string;
    password: string;
    role: UserRole;
    displayName?: string;
  }): { success: boolean; error?: string; user?: RegisteredUser } {
    const cleanEmail = params.email.trim().toLowerCase();

    // Check if user already exists
    if (this.findUserByEmail(cleanEmail)) {
      return {
        success: false,
        error: "An account with this email address is already registered. Please log in.",
      };
    }

    const fallbackName = cleanEmail
      .split("@")[0]
      .replace(/[._]/g, " ")
      .replace(/\b\w/g, (c) => c.toUpperCase());

    const newUser: RegisteredUser = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      email: cleanEmail,
      passwordHash: params.password, // In real backend: bcrypt.hash(password)
      displayName: params.displayName?.trim() || fallbackName,
      role: params.role,
      isVerified: true,
      createdAt: new Date().toISOString(),
    };

    try {
      const users = this.getAllUsers();
      users.push(newUser);
      localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
      return { success: true, user: newUser };
    } catch (err) {
      return {
        success: false,
        error: "Failed to persist user to local database. Check storage space.",
      };
    }
  }

  /**
   * Authenticate an existing user against database.
   */
  public loginUser(
    email: string,
    password: string
  ): { success: boolean; error?: string; session?: UserSession } {
    const cleanEmail = email.trim().toLowerCase();
    const user = this.findUserByEmail(cleanEmail);

    if (!user) {
      return {
        success: false,
        error: "No account found with this email. Please check spelling or register.",
      };
    }

    if (user.passwordHash !== password) {
      return {
        success: false,
        error: "Incorrect password. Please verify your credentials or reset password.",
      };
    }

    const session: UserSession = {
      type: "signed-in",
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      isVerified: user.isVerified,
      token: `tq_jwt_${btoa(`${user.id}:${Date.now()}`)}`,
      joinedAt: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    this.saveActiveSession(session);
    return { success: true, session };
  }

  /**
   * Authenticate a user via 6-digit OTP (passwordless login).
   * Verifies the OTP, loads the user record (or auto-provisions for institutional accounts),
   * and returns the authenticated UserSession.
   */
  public loginWithOtp(
    email: string,
    enteredOtp: string,
    roleOverride?: UserRole
  ): { success: boolean; error?: string; session?: UserSession } {
    const cleanEmail = email.trim().toLowerCase();
    const verifyResult = this.verifyOtp(cleanEmail, enteredOtp);
    if (!verifyResult.success) {
      return { success: false, error: verifyResult.error };
    }

    let user = this.findUserByEmail(cleanEmail);
    if (!user) {
      const role: UserRole =
        roleOverride ||
        (cleanEmail.includes("student")
          ? "Student"
          : cleanEmail.includes("nonteaching") || cleanEmail.includes("admin")
          ? "Non-Teaching Staff"
          : cleanEmail.includes("security") || cleanEmail.includes("gate")
          ? "Campus Security"
          : "Staff");

      const reg = this.registerUser({
        email: cleanEmail,
        password: `Otp@${Date.now()}`,
        role,
      });
      user = reg.user;
    }

    if (!user) {
      return { success: false, error: "Could not create user session." };
    }

    const session: UserSession = {
      type: "signed-in",
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      isVerified: true,
      token: `tq_jwt_${btoa(`${user.id}:${Date.now()}`)}`,
      joinedAt: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    this.saveActiveSession(session);
    return { success: true, session };
  }

  /**
   * Update password for an existing registered user.
   */
  public updateUserPassword(email: string, newPassword: string): boolean {
    const clean = email.trim().toLowerCase();
    const users = this.getAllUsers();
    const idx = users.findIndex((u) => u.email.toLowerCase() === clean);
    if (idx !== -1) {
      users[idx].passwordHash = newPassword;
      try {
        localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
        return true;
      } catch (e) {
        console.warn("Failed to update user password", e);
      }
    }
    return false;
  }

  /**
   * Persist active session so user never sees login on app restart.
   */
  public saveActiveSession(session: UserSession): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch (err) {
      console.warn("Could not save active session", err);
    }
  }

  /**
   * Retrieve active session on app startup.
   */
  public getActiveSession(): UserSession | null {
    if (typeof window === "undefined") return null;
    try {
      const raw = localStorage.getItem(SESSION_STORAGE_KEY);
      if (!raw) return null;
      const parsed: UserSession = JSON.parse(raw);
      // Valid session must be signed-in
      if (parsed && parsed.type === "signed-in" && parsed.email) {
        return parsed;
      }
      return null;
    } catch {
      return null;
    }
  }

  /**
   * Terminate session on sign out.
   */
  public clearActiveSession(): void {
    if (typeof window === "undefined") return;
    try {
      localStorage.removeItem(SESSION_STORAGE_KEY);
    } catch (err) {
      console.warn("Could not clear active session", err);
    }
  }

  /**
   * Create an unpersisted guest session.
   */
  public createGuestSession(): UserSession {
    return {
      type: "guest",
      displayName: "Guest Commuter",
      role: "Visitor",
      isVerified: false,
      joinedAt: new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };
  }
}

export const authService = new AuthService();

