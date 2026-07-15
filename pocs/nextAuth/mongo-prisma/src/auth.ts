import {
  createUser,
  getUserByEmail,
  getUserById
} from '@/data/user';
import { authConfig } from '@/lib/auth.config';
import database from '@/lib/database';
import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(database),
  session: {
    strategy: 'jwt',
    // strategy: 'database',
  },
  //custom pages
  pages: {
    // signIn: "/sign-in",
    // signIn: '/auth/signin',
    signIn: '/login',
    error: '/error',
  },
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    // Google: e-mail verificado
    // signIn({ user, account, profile, email, credentials }) {
    //   console.log('signIn', { user, account, profile, email, credentials });

    //   return new Promise((resolve) => {
    //     if (account?.provider === 'google') {
    //       resolve(
    //         // (profile?.email_verified && profile?.email?.endsWith("@example.com")) || false
    //         profile?.email_verified || false,
    //       );
    //     } else {
    //       resolve(true);
    //     }
    //   });
    // },

    async signIn({ user, account, profile, email, credentials }) {
      console.log({ user, account, profile, email, credentials });

      if (account?.provider === 'google') {
        // return profile?.email_verified || false; // (profile?.email_verified && profile?.email?.endsWith("@example.com")) || false
        const emailVerified = !!profile?.email_verified;

        return emailVerified;
      }

      if (account?.provider === 'credentials') {
        const existingUser = await getUserById(user.id ?? '');

        if (!existingUser || !existingUser.emailVerified) {
          return false;
        }
      }

      return true;
    },

    async jwt({ token, user }) {
      // console.log('jwt', { token, user });

      if (user) {
        const dbUser = await getUserByEmail(user?.email || '');

        if (!dbUser) {
          const res = await createUser({
            name: user.name!,
            email: user.email!,
            image: user.image || '',
          });
          token.id = res.id;
          return token;
        }

        token.id = dbUser.id;
        token.name = dbUser.name;
        token.email = dbUser.email;
        token.picture = dbUser.image;
      }

      return token;
    },

    async session({ session, token }) {
      // console.log('session', { session, token });

      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email!;
        session.user.image = token.picture;
        // if (!session.user.emailVerified) {
        //   const existingAccount = await getUserWithAccountsByEmail(token.email ?? '');
        //   // console.log(existingAccount);

        //   if(existingAccount?.emailVerified) {
        //     session.user.emailVerified = existingAccount?.emailVerified;
        //   }

        //   if (
        //     existingAccount &&
        //     !existingAccount?.emailVerified &&
        //     existingAccount?.accounts?.length > 0
        //   ) {
        //     const updatedUser = await updateUserEmailVerifiedById(existingAccount.id);
        //     session.user.emailVerified = updatedUser?.emailVerified!;
        //   }
        // }
      }

      return session;
    },

    redirect() {
      return '/login';
      // return "/sign-in";
      // return '/auth/signin';
    },
  },
});
