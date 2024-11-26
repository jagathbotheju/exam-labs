"use server";
import { AddMcqQuestionSchema } from "@/lib/schema";
import { db } from "../../db";
import {
  examQuestions,
  exams,
  incorrectAnswers,
  questions,
  studentAnswers,
  subjects,
} from "../../db/schema";
import { z } from "zod";
import { and, asc, desc, eq, count } from "drizzle-orm";
import { Question, QuestionExt } from "../../db/schema/questions";
import _ from "lodash";
import { auth } from "@/lib/auth";
import { QuestionType } from "@/server/db/schema/questionTypes";
import { User } from "@/server/db/schema/users";
import { useQuestionTypes } from "../queries/questionTypeQueries";
import {
  IncorrectAnswer,
  IncorrectAnswerExt,
} from "@/server/db/schema/incorrectAnswers";

//=====get incorrect questions by userId and subjectId
export const getIncorrectQuestions = async ({
  studentId,
  subjectId,
}: {
  studentId: string;
  subjectId: string;
}) => {
  const incorrectQuestions = await db
    .select()
    .from(incorrectAnswers)
    .where(
      and(
        eq(incorrectAnswers.studentId, studentId),
        eq(incorrectAnswers.studentId, subjectId)
      )
    );
  return incorrectQuestions as IncorrectAnswer[];
};

//========answerQuestion================================================================================================
export const answerQuestion = async ({
  examId,
  studentId,
  questionId,
  questionTypeId,
  studentAnswer,
  questionAnswer,
}: {
  examId: string;
  studentId: string;
  questionId: string;
  questionTypeId: string | null;
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

  if (studentAnswer !== questionAnswer) {
    const incorrectAnswer = await db
      .insert(incorrectAnswers)
      .values({
        studentId,
        examId,
        questionId,
        questionTypeId,
      })
      .returning();
  } else {
    const existIncorrect: IncorrectAnswer[] = await db
      .select()
      .from(incorrectAnswers)
      .where(
        and(
          eq(incorrectAnswers.questionId, questionId),
          eq(incorrectAnswers.studentId, studentId)
        )
      );
    if (existIncorrect) {
      await db
        .delete(incorrectAnswers)
        .where(
          and(
            eq(incorrectAnswers.questionId, questionId),
            eq(incorrectAnswers.studentId, studentId)
          )
        );
    }
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
      questionType && questionType.type !== "all"
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
    where:
      questionType && questionType.type !== "all"
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
