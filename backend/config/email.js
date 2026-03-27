import nodemailer from "nodemailer";

let transporter;

export function getMailer() {
  if (transporter) return transporter;

  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error("SMTP_HOST, SMTP_USER, and SMTP_PASS are required");
  }

  transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: String(process.env.SMTP_SECURE || "false") === "true",
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return transporter;
}

export async function sendContactNotification(contact) {
  const mailer = getMailer();

  await mailer.sendMail({
    from: process.env.SMTP_FROM || process.env.SMTP_USER,
    to: process.env.CONTACT_NOTIFY_TO || process.env.SMTP_USER,
    subject: `New portfolio contact from ${contact.name}`,
    text: `Name: ${contact.name}\nEmail: ${contact.email}\n\nMessage:\n${contact.message}`,
    html: `
      <h2>New Contact Message</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      <p><strong>Message:</strong></p>
      <p>${contact.message.replace(/\n/g, "<br />")}</p>
    `,
  });
}

