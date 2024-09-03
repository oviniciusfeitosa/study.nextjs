'use server';

import { signIn } from '@/auth';
import { getUserByEmail } from '@/data/user';
import database from '@/lib/database';
import { generateAndSendVerificationToken } from '@/lib/token';
import { LoginSchema, LoginValues, RegisterSchema, RegisterValues } from '@/schemas';
import { hashSync } from 'bcryptjs';
import { AuthError } from 'next-auth';
import { redirect } from 'next/navigation';
import { parseCauthError } from '@/lib/auth/errors';

export const loginCredentialsAction = async (signInValues: LoginValues) => {
  const validatedData = LoginSchema.parse(signInValues);

  if (!validatedData) {
    return { error: 'Invalid input data' };
  }

  const { email, password } = validatedData;
  const userExists = await getUserByEmail(email);

  if (!userExists || !userExists.email || !userExists.password) {
    return { error: 'User does not exist' };
  }

  try {
    await signIn('credentials', {
      email: userExists.email,
      password: password,
      // redirectTo: '/dashboard',
    });
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { error: 'Invalid credentials' };
        default:
          return { error: 'Please confirm yours email address' };
      }
    }

    throw error;
  }
  redirect('/dashboard');
};

export const registerCredentialsAction = async (data: RegisterValues) => {
  try {
    const validatedData = RegisterSchema.parse(data);

    if (!validatedData) {
      return { error: 'Invalid input data' };
    }

    const { email, name, password, passwordConfirmation } = validatedData;

    if (password !== passwordConfirmation) {
      return { error: 'Passwords do not match' };
    }

    const userExists = await database.user.findFirst({
      where: {
        email,
      },
    });

    if (userExists) {
      return { error: 'Email already is in use. Please try another one.' };
    }

    const hashedPassword = hashSync(password, 10);

    const user = await database.user.create({
      data: {
        email: email.toLowerCase(),
        name,
        password: hashedPassword,
      },
    });

    if (!user || !user.email) {
      return { error: 'An unexpected error occurred. Please try again later.' };
    }

    return await generateAndSendVerificationToken(user.email);
  } catch (error) {
    console.error('[ registerCredentialsAction Error] ', error);

    return parseCauthError(error);
  }
};
