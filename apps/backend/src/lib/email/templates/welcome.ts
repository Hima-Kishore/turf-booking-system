import { WelcomeEmailData } from "@repo/shared-types";
import { baseTemplate, ctaButton } from "./base";

export function welcomeTemplate(data: WelcomeEmailData): string {
  const content = `
    <h2 style="margin:0 0 4px;color:#111827;font-size:22px;font-weight:700;">Welcome to TurfBook, ${data.userName}! 🏟️</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">
      Your account is ready. Start booking sports facilities near you in seconds.
    </p>

    <div style="display:grid;margin-bottom:24px;">
      ${featureItem("🔍", "Search & Filter", "Find turfs by city, sport, price, and date")}
      ${featureItem("⚡", "Instant Booking", "Book your slot in under a minute")}
      ${featureItem("❌", "Free Cancellation", "Cancel up to 24 hours before for a full refund")}
      ${featureItem("⭐", "Leave Reviews", "Rate your experience after each game")}
    </div>

    ${ctaButton("Browse Turfs Now", `${process.env.FRONTEND_URL || "http://localhost:3000"}`)}

    <p style="color:#9ca3af;font-size:12px;margin:0;">
      You're receiving this because you created an account with ${data.userEmail}.
    </p>`;

  return baseTemplate(content, `Welcome aboard, ${data.userName}!`);
}

function featureItem(icon: string, title: string, desc: string): string {
  return `
    <div style="display:flex;gap:12px;margin-bottom:16px;align-items:flex-start;">
      <span style="font-size:20px;flex-shrink:0;">${icon}</span>
      <div>
        <p style="margin:0;color:#111827;font-size:14px;font-weight:600;">${title}</p>
        <p style="margin:2px 0 0;color:#6b7280;font-size:13px;">${desc}</p>
      </div>
    </div>`;
}