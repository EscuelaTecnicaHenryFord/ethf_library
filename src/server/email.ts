import { createTransport } from "nodemailer";
import type SMTPTransport from "nodemailer/lib/smtp-transport";

const config: SMTPTransport.Options | SMTPTransport = {
    host: process.env.SMTP_HOST,
    port: (process.env.SMTP_PORT && Number.isFinite(parseInt(process.env.SMTP_PORT || 'NaN'))) ? parseInt(process.env.SMTP_PORT) : 587,
    secure: process.env.SMTP_USE_SSL === 'true' || process.env.SMTP_USE_SSL === 'on' || process.env.SMTP_USE_SSL === 'yes',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
    },
    service: process.env.NODEMAILER_SMTP_SERVICE || 'Outlook365',
}

export const transporter = createTransport(config)