"use server";
import { and, desc, eq } from "drizzle-orm";
import { db } from "@/server/db";
import { studentAnswers } from "@/server/db/schema";
import {
  StudentAnswer,
  StudentAnswerExt,
} from "@/server/db/schema/studentAnswers";

export const getStudentAnswers = async ({
  examId,
  studentId,
}: {
  examId: string;
  studentId: string;
}) => {
  // const answers = await db
  //   .select()
  //   .from(studentAnswers)
  //   .where(
  //     and(
  //       eq(studentAnswers.examId, examId),
  //       eq(studentAnswers.studentId, studentId)
  //     )
  //   );
  const answers = await db.query.studentAnswers.findMany({
    where: and(
      eq(studentAnswers.examId, examId),
      eq(studentAnswers.studentId, studentId)
    ),
    with: {
      questionTypes: true,
    },
  });

  return answers as StudentAnswerExt[];
};
