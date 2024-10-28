"use server";
import { db } from "@/server/db";
import { emailTokens, passwordResetTokens, students } from "@/server/db/schema";
import { eq } from "drizzle-orm";

export const getVerificationTokenByEmail = async (email: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.email, email),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const getVerificationTokenByToken = async (token: string) => {
  try {
    const verificationToken = await db.query.emailTokens.findFirst({
      where: eq(emailTokens.token, token),
    });
    return verificationToken;
  } catch (error) {
    return null;
  }
};

export const generateEmailVerificationToken = async (email: string) => {
  const token = crypto.randomUUID();
  const expires = new Date(new Date().getTime() + 3600 * 1000);
  const existingToken = await getVerificationTokenByEmail(email);

  if (existingToken) {
    await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  }

  const verificationToken = await db
    .insert(emailTokens)
    .values({
      email,
      token,
      expires,
    })
    .returning();
  console.log("generated verification token*******", verificationToken);

  return verificationToken;
};

export const generatePasswordResetToken = async (email: string) => {
  try {
    const token = crypto.randomUUID();
    const expires = new Date(new Date().getTime() + 3600 * 1000);

    const existingToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.email, email),
    });
    if (existingToken) {
      await db
        .delete(passwordResetTokens)
        .where(eq(passwordResetTokens.email, email));
    }

    const newPasswordResetToken = await db
      .insert(passwordResetTokens)
      .values({
        email,
        token,
        expires,
      })
      .returning();
    return newPasswordResetToken;
  } catch (error) {
    return null;
  }
};

export const verifyEmailToken = async (token: string) => {
  const existingToken = await getVerificationTokenByToken(token);
  if (!existingToken) return { error: "No token found, Unable to verify!" };

  const hasExpired = new Date(existingToken.expires) < new Date();
  if (hasExpired) return { error: "Token has expired, Unable to verify" };

  const existingUser = await db.query.students.findFirst({
    where: eq(students.email, existingToken.email),
  });

  if (!existingUser) return { error: "Email does not exist" };

  await db
    .update(students)
    .set({ emailVerified: new Date() })
    .where(eq(students.email, existingToken.email));

  // await db.delete(emailTokens).where(eq(emailTokens.id, existingToken.id));
  return { success: "Email Verified, please Login" };
};
