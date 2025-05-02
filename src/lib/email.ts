/*
 * The email root. Use transporter to do
 * anything related to emails.
 */

import nodemailer from 'nodemailer'

export const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL!,
    pass: process.env.EMAIL_PASSWORD!,
  },
})
