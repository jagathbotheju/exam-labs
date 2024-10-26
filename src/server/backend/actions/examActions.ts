"use server";
import { AddExamSchema } from "@/lib/schema";
import { db } from "@/server/db";
import { examQuestions, questions } from "@/server/db/schema";
import { Exam, ExamExt, exams } from "@/server/db/schema/exams";
import { eq } from "drizzle-orm";
import { z } from "zod";

export const addExam = async ({
  examData,
}: {
  examData: z.infer<typeof AddExamSchema>;
}) => {
  const isValid = AddExamSchema.safeParse(examData);
  try {
    if (isValid.success) {
      const validData = isValid.data;
      const newExam = await db.insert(exams).values({
        name: validData.name,
        subjectId: validData.subject,
        duration: validData.duration,
      });
      if (newExam) {
        return { success: "Exam created successfully" };
      }
    } else {
      return { error: "Could not add exam" };
    }
  } catch (error) {
    return { error: "Could not add exam" };
  }
};

export const getExams = async () => {
  const exams = await db.query.exams.findMany({
    with: {
      // questions: true,
      examQuestions: true,
      subjects: true,
    },
  });
  return exams as ExamExt[];
};

export const getExamById = async (examId: string) => {
  const exam = await db.query.exams.findFirst({
    where: eq(exams.id, examId),
    with: {
      examQuestions: {
        with: {
          questions: true,
        },
      },
      subjects: true,
    },
  });

  return exam as ExamExt;
};

export const deleteExam = async (examId: string) => {
  try {
    const questionsDeleted = await db
      .delete(examQuestions)
      .where(eq(examQuestions.examId, examId))
      .returning();

    const deletedExam = await db
      .delete(exams)
      .where(eq(exams.id, examId))
      .returning();

    if (deletedExam.length) return { success: "Exam deleted successfully" };
    return { error: "Could not delete Exam DEFAULT" };
  } catch (error) {
    console.log(error);
    return { error: "Could not delete Exam SERVER" };
  }
};
