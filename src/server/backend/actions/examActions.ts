"use server";
import { AddExamSchema } from "@/lib/schema";
import { db } from "@/server/db";
import {
  examQuestions,
  questions,
  questionsMonthHistory,
  questionsYearHistory,
  studentAnswers,
} from "@/server/db/schema";
import { Exam, ExamExt, exams } from "@/server/db/schema/exams";
import { QuestionsMonthHistory } from "@/server/db/schema/questionsMonthHistory";
import {
  StudentExam,
  StudentExamExt,
  studentExams,
} from "@/server/db/schema/studentExams";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import { z } from "zod";
import _ from "lodash";
import { QuestionsYearHistory } from "@/server/db/schema/questionsYearHistory";

//==========addExam=====================================================================================================
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

//=========addExamToStudent=============================================================================================
export const addExamToStudent = async ({
  studentId,
  examId,
}: {
  studentId: string;
  examId: string;
}) => {
  try {
    const examExist = await db
      .select()
      .from(studentExams)
      .where(
        and(
          eq(studentExams.examId, examId),
          eq(studentExams.studentId, studentId)
        )
      );
    if (examExist.length) return { error: "Could not add, Exam already exist" };

    const addedExam = await db
      .insert(studentExams)
      .values({
        examId,
        studentId,
      })
      .returning();
    if (addedExam.length) {
      return { success: "Exam added Successfully" };
    }
    return { error: "Could not assign Exam to Student" };
  } catch (error) {
    return { error: "Could not assign Exam to Student" };
  }
};

//=========cancelStudentExam============================================================================================
export const cancelStudentExam = async ({
  examId,
  studentId,
}: {
  examId: string;
  studentId: string;
}) => {
  const deletedAnswers = await db
    .delete(studentAnswers)
    .where(
      and(
        eq(studentAnswers.examId, examId),
        eq(studentAnswers.studentId, studentId)
      )
    )
    .returning();
  if (deletedAnswers) return { success: "Exam cancelled successfully" };
  return { error: "Exam could not be deleted" };
};

//=========deleteExamFromStudent========================================================================================
export const deleteExamFromStudent = async ({
  examId,
  studentId,
}: {
  examId: string;
  studentId: string;
}) => {
  try {
    const deletedExam = await db
      .delete(studentExams)
      .where(
        and(
          eq(studentExams.studentId, studentId),
          eq(studentExams.examId, examId)
        )
      )
      .returning();

    const deletedStudentAnswers = await db
      .delete(studentAnswers)
      .where(
        and(
          eq(studentAnswers.examId, examId),
          eq(studentAnswers.studentId, studentId)
        )
      )
      .returning();

    const deletedYearHistory = await db
      .delete(questionsYearHistory)
      .where(
        and(
          eq(questionsYearHistory.examId, examId),
          eq(questionsYearHistory.studentId, studentId)
        )
      )
      .returning();

    const deletedMonthHistory = await db
      .delete(questionsMonthHistory)
      .where(
        and(
          eq(questionsMonthHistory.examId, examId),
          eq(questionsMonthHistory.studentId, studentId)
        )
      )
      .returning();

    if (
      deletedExam &&
      deletedStudentAnswers &&
      deletedYearHistory &&
      deletedMonthHistory
    )
      return { success: "Exam deleted successfully" };
    return { error: "Exam could not be deleted" };
  } catch (error) {
    return { error: "Exam could not be deleted" };
  }
};

//=======getExams=======================================================================================================
export const getExams = async () => {
  const allExams = await db.query.exams.findMany({
    with: {
      // questions: true,
      examQuestions: true,
      subjects: true,
    },
    orderBy: desc(exams.createdAt),
  });
  return allExams as ExamExt[];
};

//=======completeExam=======================================================================================
export const completeExam = async ({
  examId,
  subjectId,
  studentId,
  completedAt,
  marks,
  duration,
}: {
  examId: string;
  subjectId: string;
  studentId: string;
  completedAt: string;
  marks: number;
  duration: number;
}) => {
  try {
    const completedExam = await db
      .update(studentExams)
      .set({
        completedAt,
        marks,
        duration,
      })
      .where(
        and(
          eq(studentExams.examId, examId),
          eq(studentExams.studentId, studentId)
        )
      )
      .returning();

    const date = new Date();
    const monthHistoryExist = await db
      .select()
      .from(questionsMonthHistory)
      .where(
        and(
          eq(questionsMonthHistory.day, date.getUTCDate()),
          eq(questionsMonthHistory.month, date.getUTCMonth() + 1),
          eq(questionsMonthHistory.year, date.getUTCFullYear()),
          eq(questionsMonthHistory.subjectId, subjectId),
          eq(questionsMonthHistory.studentId, studentId)
        )
      );
    const yearHistoryExist = await db
      .select()
      .from(questionsYearHistory)
      .where(
        and(
          eq(questionsYearHistory.month, date.getUTCMonth()),
          eq(questionsYearHistory.year, date.getUTCFullYear()),
          eq(questionsYearHistory.subjectId, subjectId),
          eq(questionsYearHistory.studentId, studentId)
        )
      );

    // update month history
    let monthHistory = [] as QuestionsMonthHistory[];
    if (!_.isEmpty(monthHistoryExist)) {
      const existMarks = monthHistoryExist[0].marks ?? 0;
      monthHistory = await db
        .update(questionsMonthHistory)
        .set({
          marks: existMarks < marks ? marks : existMarks,
        })
        .where(
          and(
            eq(questionsMonthHistory.day, date.getUTCDate()),
            eq(questionsMonthHistory.month, date.getUTCMonth() + 1),
            eq(questionsMonthHistory.year, date.getUTCFullYear()),
            eq(questionsMonthHistory.subjectId, subjectId)
          )
        )
        .returning();
    } else {
      monthHistory = await db
        .insert(questionsMonthHistory)
        .values({
          examId,
          studentId,
          subjectId,
          marks,
          day: date.getUTCDate(),
          month: date.getUTCMonth() + 1,
          year: date.getUTCFullYear(),
        })
        .returning();
    }

    // update year history
    let yearHistory = [] as QuestionsYearHistory[];
    if (!_.isEmpty(yearHistoryExist)) {
      const existMarks = yearHistoryExist[0].marks ?? 0;
      yearHistory = await db
        .update(questionsYearHistory)
        .set({
          marks: existMarks < marks ? marks : existMarks,
        })
        .where(
          and(
            eq(questionsYearHistory.month, date.getUTCMonth()),
            eq(questionsYearHistory.year, date.getUTCFullYear()),
            eq(questionsYearHistory.subjectId, subjectId),
            eq(questionsYearHistory.studentId, studentId)
          )
        )
        .returning();
    } else {
      yearHistory = await db
        .insert(questionsYearHistory)
        .values({
          examId,
          studentId,
          subjectId,
          marks,
          month: date.getUTCMonth(),
          year: date.getUTCFullYear(),
        })
        .returning();
    }

    if (
      !_.isEmpty(completedExam) &&
      !_.isEmpty(monthHistory) &&
      !_.isEmpty(yearHistory)
    ) {
      return { success: "Exam completed successfully" };
    }

    return { error: "Error completing Exam" };
  } catch (error) {
    return { error: "Error completing Exam" };
  }
};

//=======getStudentExams================================================================================================
export const getStudentExams = async (studentId: string) => {
  const exams = await db.query.studentExams.findMany({
    where: eq(studentExams.studentId, studentId),
    with: {
      exams: {
        with: {
          studentAnswers: true,
          examQuestions: {
            with: {
              questions: true,
            },
          },
          subjects: true,
        },
      },
    },
    orderBy: [desc(studentExams.createdAt)],
  });

  return exams as StudentExamExt[];
};

//=======getStudentExam================================================================================================
export const getStudentExam = async ({
  studentId,
  examId,
}: {
  studentId: string;
  examId: string;
}) => {
  const studentExam = await db
    .select()
    .from(studentExams)
    .where(
      and(
        eq(studentExams.studentId, studentId),
        eq(studentExams.examId, examId)
      )
    );

  return studentExam[0] as StudentExam;
};

//===========getExamsBySubject==========================================================================================
export const getExamsBySubject = async (subjectId: string) => {
  const exam = await db.query.exams.findMany({
    where: eq(exams.subjectId, subjectId),
    with: {
      examQuestions: {
        with: {
          questions: true,
        },
      },
      subjects: true,
    },
  });

  return exam as ExamExt[];
};

//==========getExamById=================================================================================================
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
      studentExams: true,
    },
  });

  return exam as ExamExt;
};

//===========deleteExam=================================================================================================
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

    if (!_.isEmpty(deletedExam) && !_.isEmpty(questionsDeleted))
      return { success: "Exam deleted successfully" };
    return { error: "Could not delete Exam" };
  } catch (error) {
    return { error: "Could not delete Exam" };
  }
};
