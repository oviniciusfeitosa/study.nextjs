import { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { LoginSchema } from "../schemas";
import database from "./database";
import { compare } from "bcryptjs";

export const authConfig: NextAuthConfig = {
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
      // Se não precisar persistir no banco de dados
      // authorization: {
      //   params: {
      //     prompt: "consent",
      //     access_type: "offline",
      //     response_type: "code"
      //   }
      // }
    }),
    Credentials({
      async authorize(credentials) {
        // Validate the fields
        const validatedFields = LoginSchema.safeParse(credentials);
        if (!validatedFields.success) {
          return null;
        }
        
        const { email, password } = validatedFields.data;
        const user = await database.user.findUnique({
          where: { email },
        });
        
        if (!user || !user.password) {
          return null;
        }

        const isPasswordMatch = await compare(password, user.password);
        if (!isPasswordMatch) {
          return null;
        }

        return user;
      },
    }),
  ],
};
