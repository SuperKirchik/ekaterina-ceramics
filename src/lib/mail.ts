import nodemailer from "nodemailer";

type SendMailPayload = {
  subject: string;
  text: string;
  html: string;
  replyTo?: string;
};

function requiredEnv(name: string) {
  const value = process.env[name]?.trim();

  if (!value) {
    throw new Error(`Missing ${name}`);
  }

  return value;
}

function escapeHtml(value: string) {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

export function htmlLine(label: string, value?: string | number | null) {
  if (value === undefined || value === null || value === "") return "";

  return `<p><strong>${escapeHtml(label)}:</strong> ${escapeHtml(String(value))}</p>`;
}

export function htmlTextBlock(value: string) {
  return escapeHtml(value).replaceAll("\n", "<br />");
}

export async function sendMail({ subject, text, html, replyTo }: SendMailPayload) {
  const host = requiredEnv("SMTP_HOST");
  const user = requiredEnv("SMTP_USER");
  const pass = requiredEnv("SMTP_PASSWORD");
  const to = requiredEnv("MAIL_TO");
  const port = Number(process.env.SMTP_PORT ?? 465);
  const secure = (process.env.SMTP_SECURE ?? String(port === 465)) === "true";

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: {
      user,
      pass,
    },
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM || user,
    to,
    subject,
    text,
    html,
    replyTo,
  });
}
