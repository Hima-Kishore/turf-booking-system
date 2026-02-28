
export function baseTemplate(content: string, previewText = ""): string {
  return <!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>TurfBook</title>
  <!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
</head>
<body style="margin:0;padding:0;background:#f4f7f6;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
  ${previewText ? `<div style="display:none;max-height:0;overflow:hidden;">${previewText}&zwnj;&nbsp;</div>` : ""}
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7f6;padding:32px 16px;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
        <!-- Header -->
        <tr>
          <td style="background:#16a34a;border-radius:12px 12px 0 0;padding:24px 32px;text-align:center;">
            <h1 style="margin:0;color:#ffffff;font-size:24px;font-weight:700;letter-spacing:-0.5px;">
              ⚽ TurfBook
            </h1>
            <p style="margin:4px 0 0;color:#bbf7d0;font-size:13px;">Your Sports Booking Platform</p>
          </td>
        </tr>
        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:32px;border-left:1px solid #e5e7eb;border-right:1px solid #e5e7eb;">
            ${content}
          </td>
        </tr>
        <!-- Footer -->
        <tr>
          <td style="background:#f9fafb;border:1px solid #e5e7eb;border-top:none;border-radius:0 0 12px 12px;padding:20px 32px;text-align:center;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">
              © ${new Date().getFullYear()} TurfBook · All rights reserved<br/>
              <a href="#" style="color:#16a34a;text-decoration:none;">Unsubscribe</a> · 
              <a href="#" style="color:#16a34a;text-decoration:none;">Privacy Policy</a>
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body>
</html>
}

/** Reusable detail row */
export function detailRow(label: string, value: string): string {
  return 
    <tr>
      <td style="padding:8px 0;color:#6b7280;font-size:14px;width:140px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#111827;font-size:14px;font-weight:500;vertical-align:top;">${value}</td>
    </tr>
}

/** Green CTA button */
export function ctaButton(text: string, href: string): string {
  return 
    <table cellpadding="0" cellspacing="0" style="margin:24px 0;">
      <tr>
        <td style="background:#16a34a;border-radius:8px;">
          <a href="${href}" style="display:inline-block;padding:12px 28px;color:#ffffff;font-size:15px;font-weight:600;text-decoration:none;">${text}</a>
        </td>
      </tr>
    </table>
}