"use server";
import { signIn } from "@/lib/auth";
import { LoginSchema, RegisterSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { students } from "@/server/db/schema";
import { eq } from "drizzle-orm";
import { z } from "zod";
import { compare } from "bcryptjs";
import { generateEmailVerificationToken } from "./tokenActions";
import { sendVerificationEmail } from "./emailActions";
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
