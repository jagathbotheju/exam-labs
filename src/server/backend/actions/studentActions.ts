"use server";
import { db } from "@/server/db";
import { StudentExt } from "@/server/db/schema/students";

export const getStudents = async () => {
  const students = await db.query.students.findMany();
  return students as StudentExt[];
};
