'use server';

import { getUserByEmail, updateUserEmailVerifiedById } from '@/data/user';
import { getVerificationTokenByToken } from '@/data/verification-token';
import { parseCauthError } from '@/lib/auth/errors';
import database from '@/lib/database';
import { generateAndSendResetPasswordToken } from '@/lib/token';
import { ForgotPasswordSchema, ResetPasswordSchema, type ForgotPasswordValues, type ResetPasswordValues } from '@/schemas';
import { hashSync } from 'bcryptjs';

export const activateCredentialsEmail = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);

  if (!existingToken) {
    return { error: 'Invalid token' };
  }

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) {
    return { error: 'Token has expired' };
  }

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) {
    return { error: 'User not found' };
  }

  await updateUserEmailVerifiedById(existingUser.id);

  await database.verificationToken.delete({
    where: {
      id: existingToken.id,
    },
  });

  return { success: 'Email verified' };
};

export const sendResetPasswordCredentialsAction = async (data: ForgotPasswordValues) => {
  try {
    const validatedData = ForgotPasswordSchema.parse(data);

    if (!validatedData) {
      return { error: 'Invalid input data' };
    }

    const { email } = validatedData;
    const userExists = await database.user.findUnique({
      where: {
        email,
      },
    });

    if (!userExists) {
      // return { error: 'Email not found. Please try again' };
      console.warn('Email not found');
      return { success: 'A reset link has been sent to your email.' }; // fun :)
    }

    return await generateAndSendResetPasswordToken(email);
  } catch (error) {
    console.error('[ sendResetPasswordCredentialsAction Error] ', error);

    return parseCauthError(error);
  }
};


export const resetPasswordByTokenCredentialsAction = async (data: ResetPasswordValues) => {
  try {
    
    const validatedData = ResetPasswordSchema.parse(data);

    if (!validatedData) {
      return { error: 'Invalid input data' };
    }

    const { password, passwordConfirmation, token } = validatedData;

    // Check if passwords match
    if (password !== passwordConfirmation) {
      return { error: 'Passwords do not match' };
    }

    const existingToken = await getVerificationTokenByToken(token);

    if (!existingToken) {
      return { error: 'Token not found' };
    }

    const hasExpired = new Date(existingToken.expires).getTime() < new Date().getTime();

    if (hasExpired) {
      return { error: 'Token has expired' };
    }

    const hashedPassword = hashSync(password, 10);

    await database.user.update({
      data: {
        password: hashedPassword,
      },
      where: {
        email: existingToken.email.toLowerCase(),
      },
    });
    // remover o token

    await database.verificationToken.delete({
      where: {
        id: existingToken.id,
      },
    });

    return { success: 'Password reset successfully' };
  } catch (error) {
    console.error('[ resetPasswordByTokenCredentialsAction Error] ', error);

    return parseCauthError(error);
  }
};