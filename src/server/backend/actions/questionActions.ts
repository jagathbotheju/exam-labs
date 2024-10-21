"use server";
import { AddMcqQuestionSchema } from "@/lib/schema";
import { db } from "../../db";
import { examQuestions, exams, questions, subjects } from "../../db/schema";
import { z } from "zod";
import { and, desc, eq } from "drizzle-orm";
import { Question, QuestionExt } from "../../db/schema/questions";
import _ from "lodash";

export const addQuestion = async ({
  questionData,
  questionId,
}: {
  questionData: z.infer<typeof AddMcqQuestionSchema>;
  questionId?: string;
}) => {
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
      });
      if (newQuestion) return { success: "Question added successfully" };
    }
  }
  return {
    error: "Question could not be created/updated, please contact admin",
  };
};

export const addQuestionToExam = async ({
  questionId,
  examId,
}: {
  questionId: string;
  examId: string;
}) => {
  console.log("examId", examId);
  console.log("questionId", questionId);
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
    console.log("questionExist", questionExist);
    if (questionExist.length) return { error: "Question already exist" };

    const addedQuestion = await db
      .insert(examQuestions)
      .values({
        examId,
        questionId,
      })
      .returning();
    if (addedQuestion) {
      console.log(addedQuestion[0]);
      return { success: "Question added Successfully" };
    }
    return { error: "Could not add Question to Exam" };
  } catch (error) {
    console.log(error);
    return { error: "Could not add Question to Exam" };
  }
};

export const getQuestions = async () => {
  const allQuestions = await db
    .select()
    .from(questions)
    .orderBy(desc(questions.createdAt));
  return allQuestions as Question[];
};

export const getQuestionsBySubject = async (subjectId: string) => {
  const questionsBySubject = await db
    .select()
    .from(questions)
    .where(eq(questions.subjectId, subjectId))
    .orderBy(desc(questions.createdAt));
  return questionsBySubject as Question[];
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
