import NextAuth from "next-auth";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import Google from "next-auth/providers/google";
import Github from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { db } from "@/server/db";
import { LoginSchema } from "./schema";
import { compare } from "bcryptjs";
import { students } from "@/server/db/schema";
import { Student } from "@/server/db/schema/students";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: DrizzleAdapter(db),
  session: {
    strategy: "jwt",
  },
  secret: process.env.AUTH_SECRET,
  debug: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),

    Github({
      clientId: process.env.GITHUB_CLIENT_ID as string,
      clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
      allowDangerousEmailAccountLinking: true,
    }),

    Credentials({
      authorize: async (credentials) => {
        const validated = LoginSchema.safeParse(credentials);
        if (!validated.success) return null;

        const { email, password } = validated.data;
        const existStudent = await db.query.students.findFirst({
          where: eq(students.email, email),
        });

        if (!existStudent || existStudent.email !== email) return null;

        if (!existStudent || !existStudent.password) return null;
        const matchPassword = await compare(password, existStudent.password);
        if (!matchPassword) return null;

        return existStudent as Student;
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      const tokenUser = token.user as Student;
      if (tokenUser) {
        session.user = tokenUser;
      }

      return session;
    },
    async jwt({ token, user }) {
      if (token && token.sub) {
        const studentDB = await db.query.students.findFirst({
          where: eq(students.id, token.sub),
        });
        token.student = studentDB;
      }

      return token;
    },
  },
});
