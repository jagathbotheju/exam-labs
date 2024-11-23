"use server";
import { ProfileSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";
import { User, UserExt, users } from "@/server/db/schema/users";

export const getStudents = async () => {
  const students = await db.query.users.findMany({
    with: {
      exams: true,
    },
  });
  return students as UserExt[];
};

export const getStudentById = async (studentId: string) => {
  const student = await db.select().from(users).where(eq(users.id, studentId));
  return student[0] as User;
};

export const updateProfile = async ({
  formData,
  studentId,
}: {
  formData: z.infer<typeof ProfileSchema>;
  studentId: string;
}) => {
  const valid = ProfileSchema.safeParse(formData);
  if (valid.success) {
    const { name, image, password } = valid.data;
    await db
      .update(users)
      .set({
        name,
        image,
        password: password ? await bcrypt.hash(password, 10) : password,
      })
      .where(eq(users.id, studentId));
  }
};
