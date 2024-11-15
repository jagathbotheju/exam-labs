"use server";

import { db } from "@/server/db";
import { QuestionType, questionTypes } from "@/server/db/schema/questionTypes";
import { and, desc, eq } from "drizzle-orm";
import _ from "lodash";

//======getQuestionTypes================================================================================================
export const getQuestionTypes = async () => {
  const types = await db
    .select()
    .from(questionTypes)
    .orderBy(desc(questionTypes.createdAt));
  return types as QuestionType[];
};

//======getQuestionTypeById==============================================================================================
export const getQuestionTypeById = async (questionTypeId: string) => {
  const types = await db
    .select()
    .from(questionTypes)
    .where(eq(questionTypes.id, questionTypeId));
  return types[0] as QuestionType;
};

//======deleteQuestionType==============================================================================================
export const deleteQuestionType = async (questionTypeId: string) => {
  try {
    const deletedType = await db
      .delete(questionTypes)
      .where(eq(questionTypes.id, questionTypeId))
      .returning();

    if (deletedType.length)
      return { success: "Question Type deleted successfully" };
    return { error: "Could not delete Question Type" };
  } catch (error) {
    return { error: "Could not delete Question Type" };
  }
};

//======addQuestionType================================================================================================
export const addQuestionType = async ({ type }: { type: string }) => {
  try {
    const typeExist = await db
      .select()
      .from(questionTypes)
      .where(eq(questionTypes.type, type));
    if (!_.isEmpty(typeExist))
      return { error: "Could not add, Question Type already Exist" };

    const newType = await db.insert(questionTypes).values({ type }).returning();
    if (newType) return { success: "New Question Type added successfully" };

    return { error: "Could not add Question Type" };
  } catch (error) {
    return { error: "Could not add Question Type" };
  }
};
