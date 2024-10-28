"use server";
import { signIn } from "@/lib/auth";
import {
  LoginSchema,
  NewPasswordSchema,
  RegisterSchema,
  ResetPasswordSchema,
} from "@/lib/schema";
import { db } from "@/server/db";
import { passwordResetTokens, students } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { compare } from "bcryptjs";
import {
  generateEmailVerificationToken,
  generatePasswordResetToken,
} from "./tokenActions";
import { sendPasswordResetEmail, sendVerificationEmail } from "./emailActions";
import bcrypt from "bcryptjs";

/***************SOCIAL SIGN IN ***********************************************/
export const socialSignIn = async ({
  social,
  callback,
}: {
  social: string;
  callback: string;
}) => {
  await signIn(social, { redirectTo: callback });
};

/***************EMAIL SIGN IN ***********************************************/
export const emailSignIn = async (formData: z.infer<typeof LoginSchema>) => {
  console.log("login with email******");
  try {
    const valid = LoginSchema.safeParse(formData);
    if (!valid.success) return { error: "Insufficient data for Login" };
    const { email, password } = valid.data;

    const existingStudent = await db.query.students.findFirst({
      where: eq(students.email, email),
    });
    if (!existingStudent) return { error: "Invalid Credentials" };

    if (existingStudent?.email !== email) {
      return { error: "User not found, please register" };
    }

    if (!existingStudent.emailVerified) {
      const verificationToken = await generateEmailVerificationToken(email);
      await sendVerificationEmail({
        email: verificationToken[0].email,
        token: verificationToken[0].token,
      });
      return {
        success: "Confirmation Email sent, please verify your account",
      };
    }

    if (!existingStudent.password) return { error: "Invalid Credentials" };
    const matchPassword = await compare(password, existingStudent.password);
    if (!matchPassword) return { error: "Invalid Credentials" };

    await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    return { success: "Successfully LoggedIn" };
  } catch (error) {
    return { error: "Invalid Credentials" };
  }
};

/***************REGISTER USER***********************************************/
export const registerUser = async ({
  formData,
}: {
  formData: z.infer<typeof RegisterSchema>;
}) => {
  const valid = RegisterSchema.safeParse(formData);
  if (!valid.success) return { error: "Invalid data, please try again" };
  const { email, password, name, dob, school, grade } = valid.data;

  const userExist = await db.query.students.findFirst({
    where: eq(students.email, email),
  });
  if (userExist) {
    return {
      error: "Email already in use, please use different email address",
    };
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  await db.insert(students).values({
    email,
    name,
    password: hashedPassword,
    dob,
    school,
    grade,
  });

  const verificationToken = await generateEmailVerificationToken(email);
  await sendVerificationEmail({
    email: verificationToken[0].email,
    token: verificationToken[0].token,
    name,
  });

  return { success: "Confirmation Email sent" };
};

/***************RESET PASSWORD *********************************************/
export const resetPassword = async (
  formData: z.infer<typeof ResetPasswordSchema>
) => {
  const valid = ResetPasswordSchema.safeParse(formData);
  if (!valid.success) return { error: "Invalid data" };
  const { email } = valid.data;

  const existingStudent = await db.query.students.findFirst({
    where: eq(students.email, email),
  });
  if (!existingStudent) return { error: "No Student fond!" };

  const passwordResetToken = await generatePasswordResetToken(email);
  if (!passwordResetToken) return { error: "Could not generate token" };

  await sendPasswordResetEmail({
    email: passwordResetToken[0].email,
    token: passwordResetToken[0].token,
  });

  return { success: "Reset password Email Sent, Please check your email" };
};

/***************NEW PASSWORD ***********************************************/
export const createNewPassword = async ({
  formData,
}: {
  formData: z.infer<typeof NewPasswordSchema>;
}) => {
  try {
    const isValid = NewPasswordSchema.safeParse(formData);
    if (!isValid.success) return { error: "Invalid data" };
    const { token, password } = isValid.data;

    if (!token) return { error: "No token found, please try again" };

    const existingToken = await db.query.passwordResetTokens.findFirst({
      where: eq(passwordResetTokens.token, token),
    });

    if (!existingToken) return { error: "Token not found, please try again" };

    const hasExpired = new Date(existingToken.expires) < new Date();
    if (hasExpired) return { error: "Token expired" };

    const existingStudent = await db.query.students.findFirst({
      where: eq(students.email, existingToken.email),
    });
    if (!existingStudent) return { error: "User not found" };

    const hashedPassword = await bcrypt.hash(password, 10);

    const updatedStudent = await db
      .update(students)
      .set({
        password: hashedPassword,
      })
      .where(eq(students.id, existingStudent.id))
      .returning();

    const deletedToken = await db
      .delete(passwordResetTokens)
      .where(eq(passwordResetTokens.id, existingToken.id))
      .returning();

    // await db.transaction(async (tx)=>{
    //   await db
    //     .update(user)
    //     .set({
    //       password: hashedPassword,
    //     })
    //     .where(eq(user.id, existingUser.id));
    //   await db
    //     .delete(passwordResetToken)
    //     .where(eq(passwordResetToken.id, existingToken.id));
    // })

    if (updatedStudent && deletedToken) {
      return { success: "Password updated successfully, please Login" };
    }

    return { success: "Could not update password, please try again later" };
  } catch (error) {
    console.log("new password error", error);
    return { error: "Internal Server Error" };
  }
};
