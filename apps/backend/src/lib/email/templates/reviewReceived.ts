import { ReviewEmailData } from "@repo/shared-types";
import { baseTemplate } from "./base";

export function reviewReceivedTemplate(data: ReviewEmailData): string {
  const stars = "★".repeat(data.rating) + "☆".repeat(5 - data.rating);
  const sentiment =
    data.rating >= 4 ? "positive" : data.rating === 3 ? "neutral" : "critical";
  const sentimentColors: Record<string, string> = {
    positive: "#f0fdf4",
    neutral: "#fffbeb",
    critical: "#fef2f2",
  };
  const sentimentBorder: Record<string, string> = {
    positive: "#bbf7d0",
    neutral: "#fde68a",
    critical: "#fecaca",
  };

  const content = `
    <h2 style="margin:0 0 4px;color:#111827;font-size:22px;font-weight:700;">New Review Received</h2>
    <p style="margin:0 0 24px;color:#6b7280;font-size:15px;">
      A guest has left a review for <strong>${data.turfName}</strong>.
    </p>

    <div style="background:${sentimentColors[sentiment]};border:1px solid ${sentimentBorder[sentiment]};border-radius:10px;padding:20px 24px;margin-bottom:24px;">
      <div style="display:flex;align-items:center;gap:12px;margin-bottom:12px;">
        <div style="background:#16a34a;color:#fff;border-radius:50%;width:40px;height:40px;display:flex;align-items:center;justify-content:center;font-weight:700;font-size:16px;flex-shrink:0;">${data.reviewerName[0].toUpperCase()}</div>
        <div>
          <p style="margin:0;color:#111827;font-size:15px;font-weight:600;">${data.reviewerName}</p>
          <p style="margin:2px 0 0;color:#d97706;font-size:18px;letter-spacing:1px;">${stars}</p>
        </div>
      </div>
      <p style="margin:0;color:#374151;font-size:14px;line-height:1.6;font-style:italic;">"${data.comment}"</p>
      <p style="margin:12px 0 0;color:#9ca3af;font-size:12px;">Court: ${data.courtName}</p>
    </div>

    <p style="color:#6b7280;font-size:13px;line-height:1.6;margin:0;">
      View all reviews in your <a href="${process.env.FRONTEND_URL || "http://localhost:3000"}/admin/turfs" style="color:#16a34a;font-weight:500;">admin dashboard</a>.
    </p>`;

  return baseTemplate(content, `${data.reviewerName} gave ${data.rating} stars for ${data.turfName}`);
}