"use server";
import VerifyEmailTemp from "@/lib/emailTemplates/VerifyEmailTemp";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);
const domain = process.env.BASE_URL;

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
