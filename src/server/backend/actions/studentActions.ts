"use server";
import { ProfileSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { StudentExt, students } from "@/server/db/schema/students";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const getStudents = async () => {
  const students = await db.query.students.findMany();
  return students as StudentExt[];
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
      .update(students)
      .set({
        name,
        image,
        password: password ? await bcrypt.hash(password, 10) : password,
      })
      .where(eq(students.id, studentId));
  }
};
