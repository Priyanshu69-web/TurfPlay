import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendEmail = async ({ to, subject, html }) => {
  try {
    const data = await resend.emails.send({
      from: 'TurfPlay <onboarding@resend.dev>', // You can use your custom domain if verified
      to,
      subject,
      html,
    });
    return { success: true, data };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error };
  }
};

export const sendOtpEmail = async (email, otp) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #10b981; text-align: center;">Welcome to TurfPlay!</h2>
      <p>Your verification code is:</p>
      <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937; border-radius: 5px;">
        ${otp}
      </div>
      <p style="margin-top: 20px;">This code will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="font-size: 12px; color: #6b7280; text-align: center;">&copy; 2026 TurfPlay. All rights reserved.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'Your TurfPlay Verification Code', html });
};

export const sendResetPasswordEmail = async (email, token) => {
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px;">
      <h2 style="color: #10b981; text-align: center;">Reset Your Password</h2>
      <p>You requested a password reset. Your reset code is:</p>
      <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; color: #1f2937; border-radius: 5px;">
        ${token}
      </div>
      <p style="margin-top: 20px;">This code will expire in 30 minutes.</p>
      <p>If you didn't request this, you can safely ignore this email.</p>
      <hr style="border: none; border-top: 1px solid #e0e0e0; margin: 20px 0;">
      <p style="font-size: 12px; color: #6b7280; text-align: center;">&copy; 2026 TurfPlay. All rights reserved.</p>
    </div>
  `;
  return sendEmail({ to: email, subject: 'TurfPlay Password Reset Request', html });
};
