'use server';

import { signIn, signOut } from '@/auth';
import { isRedirectError } from 'next/dist/client/components/redirect';
import { redirect } from 'next/navigation';

export async function signInWithGoogle() {
  await signIn('google');
}

export async function authSignOut() {
  try {
    await signOut({ redirect: false });
  } catch (err) {
    if (isRedirectError(err)) {
      console.error(err);
      throw err;
    }
  } finally {
    redirect('/');
  }
}
