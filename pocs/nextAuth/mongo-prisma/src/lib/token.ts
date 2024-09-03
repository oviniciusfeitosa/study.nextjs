import { getVerificationTokenByEmail } from '@/data/verification-token';
import { v4 as uuidv4 } from 'uuid';
import database from './database';
import { sendEmail } from './mail';
import type { VerificationToken } from '@prisma/client';
import nodemailer from 'nodemailer';

type VeritificationTokenIdentifier = 'email_verification' | 'reset_password';

const generateVerificationToken = async (
  email: string,
  identifier: VeritificationTokenIdentifier,
  existingToken: VerificationToken | null = null
) => {
  const token = uuidv4();
  const expires = new Date().getTime() + 1000 * 60 * 60 * 1; // 1 hours
  if(!existingToken) {
    existingToken = await getVerificationTokenByEmail(email);
  }

  if (existingToken) {
    // if (existingToken.expires.getTime() > new Date().getTime()) {
    if (existingToken.expires > new Date()) {
      return existingToken;
    }
    await database.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });
  }

  const verificationToken = await database.verificationToken.create({
    data: {
      email,
      token,
      expires: new Date(expires),
      identifier,
    },
  });

  return verificationToken;
};

async function sendVerificationTokenEmail(verificationToken: VerificationToken) {
  const domain = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const confirmationLink = `${domain}/verify-email?token=${verificationToken.token}`;
  const mailOptions: nodemailer.SendMailOptions = {
    html: `Please click on the following link to verify your email: <a href="${confirmationLink}">${confirmationLink}</a>`,
    from: process.env.SMTP_SERVER_FROM || '"Your App Name" <user@gmail.com>',
    to: verificationToken.email,
    subject: 'Verify your email',
  };
  return sendVerificationToken(
    verificationToken,
    mailOptions,
    'Email Verification was sent to your email.',
  );
}

export const generateAndSendVerificationToken = async (email: string) => {
  const verificationToken = await generateVerificationToken(email, 'email_verification');
  return await sendVerificationTokenEmail(verificationToken);
};

async function sendResetPasswordTokenEmail(verificationToken: VerificationToken) {
  const domain = process.env.NEXTAUTH_URL || 'http://localhost:3000';
  const confirmationLink = `${domain}/reset-password?token=${verificationToken.token}`;
  const mailOptions: nodemailer.SendMailOptions = {
    html: `Please click on the following link to reset your password: <a href="${confirmationLink}">${confirmationLink}</a>`,
    from: process.env.SMTP_SERVER_FROM || '"Your App Name" <user@gmail.com>',
    to: verificationToken.email,
    subject: 'Reset your password',
  };
  return sendVerificationToken(
    verificationToken,
    mailOptions,
    'A reset link has been sent to your email.',
  );
}

export const generateAndSendResetPasswordToken = async (email: string) => {
  const verificationToken = await generateVerificationToken(email, 'reset_password');
  return await sendResetPasswordTokenEmail(verificationToken);
};

export const sendVerificationToken = async (
  verificationToken: VerificationToken,
  mailOptions: nodemailer.SendMailOptions,
  successMessage: string,
) => {
  if (
    verificationToken.emailSentAt &&
    new Date().getTime() - verificationToken.emailSentAt.getTime() < 5 * 60 * 1000
  ) {
    return { error: 'Please wait a few minutes before trying again.' };
  }

  try {
    const requiredFields = ['from', 'to', 'subject', 'html'];
    const missingField = requiredFields.find((field) => !(field in mailOptions));

    if (missingField) {
      throw new Error(`The "${missingField}" field is required.`);
    }

    const { from, to, subject, html } = mailOptions;

    await sendEmail({
      from,
      to,
      subject,
      html,
    });
    await database.verificationToken.update({
      where: {
        email_token: {
          email: verificationToken.email,
          token: verificationToken.token,
        },
      },
      data: {
        emailSentAt: new Date(),
      },
    });
    return { success: successMessage };
  } catch (error) {
    console.log(error);
    return { error: 'Email could not be sent' };
  }

  
};
