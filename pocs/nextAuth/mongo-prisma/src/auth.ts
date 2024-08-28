import NextAuth from 'next-auth';
import { authConfig } from '@/lib/auth.config';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { createUser, fetchUserWithEmail } from '@/app/_actions/users';
import db from '@/lib/db';

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  adapter: PrismaAdapter(db),
  session: {
    strategy: 'jwt',
  },
  // pages: {
  //   // signIn: "/sign-in",
  //   signIn: '/auth/signin',
  // },
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    // Google: e-mail verificado
    // signIn({ user, account, profile, email, credentials }) {
    //   return new Promise((resolve) => {
    //     if (account?.provider === "google") {
    //       resolve(
    //         (profile?.email_verified && profile?.email?.endsWith("@example.com")) || false
    //       );
    //     } else {
    //       resolve(true);
    //     }
    //   });
    // },

    async jwt({ token, user }) {
      console.log('jwt', { token, user });

      if (user) {
        const dbUser = await fetchUserWithEmail(user?.email || '');

        if (!dbUser) {
          const res = await createUser({
            name: user.name!,
            email: user.email!,
            image: user.image!,
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
      // console.log("session", { session, token });

      if (token) {
        session.user.id = token.id;
        session.user.name = token.name;
        session.user.email = token.email!;
        session.user.image = token.picture;
      }

      return session;
    },

    redirect() {
      // return "/sign-in";
      return '/auth/signin';
    },
  },
});
