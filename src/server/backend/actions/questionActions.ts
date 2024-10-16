"use server";
import { AddMcqQuestionSchema } from "@/lib/schema";
import { db } from "../../db";
import { questions, subjects } from "../../db/schema";
import { z } from "zod";
import { eq } from "drizzle-orm";
import { Question } from "../../db/schema/questions";

export const addQuestion = async ({
  questionData,
  questionId,
}: {
  questionData: z.infer<typeof AddMcqQuestionSchema>;
  questionId?: string;
}) => {
  console.log("add question **************", questionId);
  const isValid = AddMcqQuestionSchema.safeParse(questionData);

  if (isValid.success) {
    const validData = isValid.data;

    if (questionId) {
      console.log("updating question **************");
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
      console.log("creating question **************");
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

export const getQuestions = async () => {
  const allQuestions = await db.select().from(questions);
  return allQuestions as Question[];
};

export const getQuestionsBySubject = async (subjectId: string) => {
  const questionsBySubject = await db
    .select()
    .from(questions)
    .where(eq(questions.subjectId, subjectId));
  // console.log("questions server", questionsBySubject);
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
