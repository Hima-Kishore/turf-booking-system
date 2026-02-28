import nodemailer from "nodemailer";
import type { Transporter } from "nodemailer";

let transporter: Transporter | null = null;

export async function getTransporter(): Promise<Transporter> {
  if (transporter) return transporter;

  if (process.env.NODE_ENV === "production" && process.env.RESEND_API_KEY) {
    transporter = nodemailer.createTransport({
      host: "smtp.resend.com",
      port: 465,
      secure: true,
      auth: {
        user: "resend",
        pass: process.env.RESEND_API_KEY,
      },
    });
    console.log("📧 Email: using Resend SMTP");
  } else {
    const testAccount = await nodemailer.createTestAccount();
    transporter = nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
    console.log("📧 Email: using Ethereal (dev mode)");
    console.log(`   Preview URL will log after each send`);
    console.log(`   Ethereal login: ${testAccount.user} / ${testAccount.pass}`);
  }

  return transporter;
}

export async function sendMail(options: {
  from?: string;
  to: string;
  subject: string;
  html: string;
  text?: string;
}): Promise<void> {
  const t = await getTransporter();
  const from =
    options.from ||
    process.env.EMAIL_FROM ||
    '"TurfBook" <noreply@turfbook.app>';

  const info = await t.sendMail({ ...options, from });

  const previewUrl = nodemailer.getTestMessageUrl(info);
  if (previewUrl) {
    console.log(`📧 Email preview: ${previewUrl}`);
  }
}