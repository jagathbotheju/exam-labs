"use server";
import { desc, eq } from "drizzle-orm";
import { db } from "../../db";
import { subjects } from "../../db/schema";
import { Subject } from "../../db/schema/subjects";

export const addSubject = async ({ title }: { title: string }) => {
  try {
    const newSubject = await db.insert(subjects).values({ title });
    if (newSubject) {
      return { success: "Subject created successfully" };
    }
  } catch (err) {
    return { error: "Could not add subject" };
  }
};

export const deleteSubject = async (subjectId: string) => {
  try {
    const deletedSubject = await db
      .delete(subjects)
      .where(eq(subjects.id, subjectId));
    if (deletedSubject) {
      return { success: "Subject deleted successfully" };
    }
  } catch (error) {
    return { error: "Could not delete subject" };
  }
};

export const getSubjects = async () => {
  const allSubjects = await db
    .select()
    .from(subjects)
    .orderBy(desc(subjects.title));
  return allSubjects as Subject[];
};
