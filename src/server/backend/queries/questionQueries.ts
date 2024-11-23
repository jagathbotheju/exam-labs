import { useQuery } from "@tanstack/react-query";
import {
  getQuestionById,
  getQuestions,
  getQuestionsBySubject,
  getQuestionsBySubjectPagination,
  getQuestionsCount,
} from "../actions/questionActions";
import { QuestionType } from "@/server/db/schema/questionTypes";

export const useQuestions = () => {
  return useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions(),
  });
};

export const useQuestionsCount = ({
  questionType,
  subjectId,
}: {
  questionType?: QuestionType;
  subjectId: string;
}) => {
  return useQuery({
    queryKey: ["questions-count"],
    queryFn: () => getQuestionsCount({ questionType, subjectId }),
  });
};

export const useQuestionsBySubject = (subjectId: string) => {
  return useQuery({
    queryKey: ["questions-by-subject"],
    queryFn: () => getQuestionsBySubject(subjectId),
  });
};

export const useQuestionsBySubjectPagination = ({
  subjectId,
  questionType,
  page,
}: {
  subjectId: string;
  questionType?: QuestionType;
  page: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ["questions-by-subject-pagination"],
    queryFn: () =>
      getQuestionsBySubjectPagination({ subjectId, questionType, page }),
  });
};

export const useQuestionById = (questionId: string) => {
  return useQuery({
    queryKey: ["question-by-id"],
    queryFn: () => getQuestionById(questionId),
  });
};
