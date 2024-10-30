"use server";
import PasswordResetTemp from "@/lib/emailTemplates/PasswordResetTem";
import VerifyEmailTemp from "@/lib/emailTemplates/VerifyEmailTemp";
import { Resend } from "resend";
import nodemailer from "nodemailer";
import _ from "lodash";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.BASE_URL;

export const sendMail = async ({
  to,
  subject,
  body,
}: {
  to: string;
  subject: string;
  body: string;
}) => {
  const { SMTP_EMAIL, SMTP_GMAIL_PASS } = process.env;
  const transport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: SMTP_EMAIL,
      pass: SMTP_GMAIL_PASS,
    },
  });

  try {
    const sendResult = await transport.sendMail({
      from: SMTP_EMAIL,
      to,
      subject,
      html: body,
    });

    console.log(sendResult);
    if (!_.isEmpty(sendResult.accepted)) {
      return { success: "Email Sent Successfully" };
    }

    return { error: "Could not send activation link, try again later" };
  } catch (error) {
    console.log(error);
    return { error: "Internal server error ,sending email" };
  }
};

export const sendVerificationEmail = async ({
  email,
  token,
  name,
}: {
  email: string;
  token: string;
  name?: string;
}) => {
  const confirmLink = `${domain}/auth/email-verification/?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "ExamLabs | Confirmation Email",
    // html: `<p>Click to <a href=${confirmLink}>Confirm your email</a></p>`,
    react: <VerifyEmailTemp url={confirmLink} />,
  });
  if (error) return console.log(error);
  if (data) return data;
};

export const sendPasswordResetEmail = async ({
  email,
  token,
}: {
  email: string;
  token: string;
}) => {
  const confirmLink = `${domain}/auth/new-password/?token=${token}`;
  const { data, error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: "ExamLabs | Confirmation Email",
    // html: `<p>Click to <a href=${confirmLink}>Reset your password</a></p>`,
    react: <PasswordResetTemp url={confirmLink} />,
  });
  if (error) return console.log(error);
  if (data) return data;
};
