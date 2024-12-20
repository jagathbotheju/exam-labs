"use server";
import { AddMcqQuestionSchema } from "@/lib/schema";
import { db } from "../../db";
import {
  examQuestions,
  exams,
  incorrectQuestions,
  questions,
  questionsTypeHistory,
  studentAnswers,
  subjects,
} from "../../db/schema";
import { z } from "zod";
import { and, asc, desc, eq, count, sql } from "drizzle-orm";
import { Question, QuestionExt } from "../../db/schema/questions";
import _ from "lodash";
import { auth } from "@/lib/auth";
import { QuestionType, questionTypes } from "@/server/db/schema/questionTypes";
import { User } from "@/server/db/schema/users";
import { useQuestionTypes } from "../queries/questionTypeQueries";

import {
  IncorrectQuestion,
  IncorrectQuestionExt,
} from "@/server/db/schema/incorrectQuestions";
import { QuestionsTypeHistory } from "@/server/db/schema/questionsTypeHistory";
import { Exam, ExamExt } from "@/server/db/schema/exams";
import { ExamQuestion } from "@/server/db/schema/examQuestions";

export const getExamQuestions = async () => {
  const exams = await db.query.examQuestions.findMany({
    with: {
      exams: true,
    },
  });

  return exams as ExamQuestion[];
};

//=====get incorrect questions by userId and subjectId
export const getIncorrectQuestions = async ({
  studentId,
  subjectId,
}: {
  studentId?: string;
  subjectId?: string;
}) => {
  if (!studentId || !subjectId) return [];
  const incorrect = await db.query.incorrectQuestions.findMany({
    with: {
      questions: true,
    },
  });
  if (!_.isEmpty(incorrect)) {
    const questionsBySubject = incorrect.map((item) => {
      if (item.questions?.subjectId === subjectId) {
        return item.questions;
      }
    });
    return questionsBySubject as QuestionExt[];
  }

  return [];
};

//========answerQuestion================================================================================================
export const answerQuestion = async ({
  examId,
  studentId,
  questionId,
  questionTypeId,
  subjectId,
  studentAnswer,
  questionAnswer,
}: {
  examId: string;
  studentId: string;
  questionId: string;
  questionTypeId: string | null;
  subjectId: string;
  studentAnswer: string;
  questionAnswer: string;
}) => {
  const answer = await db
    .insert(studentAnswers)
    .values({
      examId,
      studentId,
      questionId,
      questionTypeId,
      studentAnswer,
      questionAnswer,
    })
    .onConflictDoUpdate({
      target: [
        studentAnswers.examId,
        studentAnswers.studentId,
        studentAnswers.questionId,
      ],
      set: {
        studentAnswer,
      },
    });

  const existIncorrect: IncorrectQuestion[] = await db
    .select()
    .from(incorrectQuestions)
    .where(
      and(
        eq(incorrectQuestions.questionId, questionId),
        eq(incorrectQuestions.studentId, studentId)
      )
    );

  // const existQuestionTypeHistory = (await db
  //   .select()
  //   .from(questionsTypeHistory)
  //   .where(
  //     and(
  //       eq(questionsTypeHistory.questionTypeId, questionTypeId ?? ""),
  //       eq(questionsTypeHistory.studentId, studentId),
  //       eq(questionsTypeHistory.questionId, questionId)
  //     )
  //   )) as QuestionsTypeHistory[];

  //update QuestionTypeHistory
  // if (
  //   !_.isEmpty(existQuestionTypeHistory) &&
  //   studentAnswer !== questionAnswer
  // ) {
  //   await db.update(questionsTypeHistory).set({
  //     totalCorrectQuestions: sql`${questionsTypeHistory.totalCorrectQuestions}-1`,
  //   });
  // } else if (
  //   _.isEmpty(existQuestionTypeHistory) &&
  //   studentAnswer === questionAnswer
  // ) {
  //   await db.insert(questionsTypeHistory).values({
  //     questionId,
  //     questionTypeId: questionTypeId ?? "",
  //     subjectId,
  //     studentId,
  //     totalCorrectQuestions: sql`${questionsTypeHistory.totalCorrectQuestions}+1`,
  //     totalQuestions: sql`${questionsTypeHistory.totalQuestions}+1`,
  //   });
  // } else if (
  //   _.isEmpty(existQuestionTypeHistory) &&
  //   studentAnswer !== questionAnswer
  // ) {
  //   await db.update(questionsTypeHistory).set({
  //     totalQuestions: sql`${questionsTypeHistory.totalQuestions}+1`,
  //   });
  // }

  if (!_.isEmpty(existIncorrect) && studentAnswer === questionAnswer) {
    // update incorrect questions
    await db
      .delete(incorrectQuestions)
      .where(
        and(
          eq(incorrectQuestions.questionId, questionId),
          eq(incorrectQuestions.studentId, studentId)
        )
      );
  } else if (_.isEmpty(existIncorrect) && studentAnswer !== questionAnswer) {
    await db.insert(incorrectQuestions).values({
      studentId,
      examId,
      questionId,
      questionTypeId,
    });
  }
};

//===========addQuestion================================================================================================
export const addQuestion = async ({
  questionData,
  questionId,
}: {
  questionData: z.infer<typeof AddMcqQuestionSchema>;
  questionId?: string;
}) => {
  const session = await auth();
  const user = session?.user as User;
  if (!user) return { error: "Please LogIn" };
  if (user.role !== "admin") return { error: "Not Authorized!" };

  const isValid = AddMcqQuestionSchema.safeParse(questionData);

  if (isValid.success) {
    const validData = isValid.data;

    if (questionId) {
      const updatedQuestion = await db
        .update(questions)
        .set({
          body: validData.body,
          option1: validData.option1,
          option2: validData.option2,
          option3: validData.option3,
          option4: validData.option4,
          answer: validData.answer,
          term: validData.term,
          grade: validData.grade,
          subjectId: validData.subject,
          typeId: validData.type,
          image: validData.image,
        })
        .where(eq(questions.id, questionId));
      if (updatedQuestion) {
        return { success: "Product updated successfully" };
      }
    } else {
      const newQuestion = await db.insert(questions).values({
        body: validData.body,
        option1: validData.option1,
        option2: validData.option2,
        option3: validData.option3,
        option4: validData.option4,
        answer: validData.answer,
        term: validData.term,
        grade: validData.grade,
        subjectId: validData.subject,
        typeId: validData.type,
        image: validData.image,
      });
      if (newQuestion) return { success: "Question added successfully" };
    }
  }
  return {
    error: "Question could not be created/updated, please contact admin",
  };
};

//===========addQuestionToExam==========================================================================================
export const addQuestionToExam = async ({
  questionId,
  questionNumber,
  examId,
}: {
  questionId: string;
  questionNumber: number;
  examId: string;
}) => {
  try {
    const questionExist = await db
      .select()
      .from(examQuestions)
      .where(
        and(
          eq(examQuestions.examId, examId),
          eq(examQuestions.questionId, questionId)
        )
      );
    if (questionExist.length)
      return { error: "Could not add, Question already exist" };

    const addedQuestion = await db
      .insert(examQuestions)
      .values({
        examId,
        questionId,
        questionNumber,
      })
      .returning();
    if (addedQuestion.length) {
      return { success: "Question added Successfully" };
    }
    return { error: "Could not add Question to Exam" };
  } catch (error) {
    return { error: "Could not add Question to Exam" };
  }
};

//============removeQuestionFromExam====================================================================================
export const removeQuestionFromExam = async ({
  questionId,
  examId,
}: {
  questionId: string;
  examId: string;
}) => {
  try {
    const deletedQuestion = await db
      .delete(examQuestions)
      .where(
        and(
          eq(examQuestions.examId, examId),
          eq(examQuestions.questionId, questionId)
        )
      )
      .returning();
    if (deletedQuestion.length) {
      return { success: "Question deleted Successfully" };
    }
    return { error: "Could not delete Question from Exam" };
  } catch (error) {
    return { error: "Could not delete Question from Exam" };
  }
};

export const getQuestions = async () => {
  const allQuestions = await db
    .select()
    .from(questions)
    .orderBy(desc(questions.createdAt));
  return allQuestions as Question[];
};

export const getQuestionsCount = async ({
  subjectId,
  questionType,
}: {
  subjectId: string;
  questionType?: QuestionType;
}) => {
  const questionsCount = await db
    .select({ count: count() })
    .from(questions)
    .where(
      !_.isEmpty(questionType)
        ? and(
            eq(questions.subjectId, subjectId),
            eq(questions.typeId, questionType.id)
          )
        : eq(questions.subjectId, subjectId)
    );
  return questionsCount[0];
};

export const getQuestionsBySubject = async (subjectId: string) => {
  const questionsBySubject = await db.query.questions.findMany({
    with: {
      examQuestions: true,
    },
    where: eq(questions.subjectId, subjectId),
    orderBy: asc(questions.createdAt),
  });

  return questionsBySubject as QuestionExt[];
};

export const getQuestionsBySubjectPagination = async ({
  subjectId,
  questionType,
  page,
  pageSize = 10,
}: {
  subjectId: string;
  questionType?: QuestionType;
  page: number;
  pageSize?: number;
}) => {
  const questionsBySubject = await db.query.questions.findMany({
    with: {
      examQuestions: true,
    },
    where: !_.isEmpty(questionType)
      ? and(
          eq(questions.subjectId, subjectId),
          eq(questions.typeId, questionType.id)
        )
      : eq(questions.subjectId, subjectId),
    orderBy: asc(questions.createdAt),
    limit: pageSize,
    offset: (page - 1) * pageSize,
  });

  return questionsBySubject as QuestionExt[];
};

export const getQuestionById = async (questionId: string) => {
  const questionById = await db
    .select()
    .from(questions)
    .where(eq(questions.id, questionId));
  return questionById as Question[];
};

export const deleteQuestion = async (questionId: string) => {
  const deletedQuestion = await db
    .delete(questions)
    .where(eq(questions.id, questionId));

  if (deletedQuestion) {
    return { success: "Question deleted Successfully" };
  }
};
