
import nodemailer from 'nodemailer';

// configure the nodemailer transport
export const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAILER_USER,
        pass: process.env.MAILER_PASS
    }
});