"use server";
import { ProfileSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { Student, StudentExt, students } from "@/server/db/schema/students";
import { z } from "zod";
import bcrypt from "bcryptjs";
import { eq } from "drizzle-orm";

export const getStudents = async () => {
  const students = await db.query.students.findMany({
    with: {
      exams: true,
    },
  });
  return students as StudentExt[];
};

export const getStudentById = async (studentId: string) => {
  const student = await db
    .select()
    .from(students)
    .where(eq(students.id, studentId));
  return student[0] as Student;
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
