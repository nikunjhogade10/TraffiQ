/**
 * TraffiQ — MIT-ADT Campus Smart Traffic & Gate Monitoring System
 * Module: Cloud Email Dispatcher Service
 * 
 * Safely dispatches 6-digit OTP verification emails via AWS Lambda Function URL
 * with a strict 4-second timeout and 100% fail-safe fallback to ensure
 * live academic demonstrations and exam vivas never crash or freeze.
 */

const EMAIL_DISPATCHER_ENDPOINT =
  "https://vlvddgeyfrckuawc5qalkg6udm0qdzwa.lambda-url.ap-south-1.on.aws/";

export interface SendOtpResult {
  success: boolean;
  realEmailSent: boolean;
  message?: string;
  error?: string;
}

export class EmailService {
  /**
   * Dispatches an OTP verification code to a recipient email.
   * If the cloud network or Gmail SMTP is slow or offline, it safely times out
   * after 4000ms and returns realEmailSent: false without throwing any errors.
   */
  public async sendVerificationOtp(
    email: string,
    otp: string,
    purpose: "SIGNUP" | "RESET" = "SIGNUP",
    name?: string
  ): Promise<SendOtpResult> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanOtp = otp.trim();

    if (!cleanEmail || !cleanOtp) {
      return {
        success: false,
        realEmailSent: false,
        error: "Email and OTP code are required",
      };
    }

    // Safety timeout controller: Aborts after 4 seconds to prevent UI hangs
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);

    try {
      const response = await fetch(EMAIL_DISPATCHER_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: cleanEmail,
          otp: cleanOtp,
          purpose,
          name: name?.trim() || "",
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.warn("[EmailService] AWS Lambda responded with non-200:", response.status, errorText);
        return {
          success: true, // App flow continues smoothly
          realEmailSent: false,
          error: `HTTP ${response.status}`,
        };
      }

      const data = await response.json();
      return {
        success: true,
        realEmailSent: !!data.success,
        message: data.message || `Code dispatched to ${cleanEmail}`,
      };
    } catch (err: any) {
      clearTimeout(timeoutId);
      const isTimeout = err?.name === "AbortError";
      console.warn(
        `[EmailService] Cloud email dispatch ${isTimeout ? "timed out (4s)" : "offline/unreachable"}. Activating viva fallback mode.`
      );

      // Safe return: Never throw or crash the app
      return {
        success: true,
        realEmailSent: false,
        error: isTimeout ? "Network timeout" : "Network unreachable",
      };
    }
  }
}

export const emailService = new EmailService();

