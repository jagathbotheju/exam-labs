import { useQuery } from "@tanstack/react-query";
import {
  getQuestionById,
  getQuestions,
  getQuestionsBySubject,
} from "../actions/questionActions";

export const useQuestions = () => {
  return useQuery({
    queryKey: ["questions"],
    queryFn: () => getQuestions(),
  });
};

export const useQuestionsBySubject = (subjectId: string) => {
  return useQuery({
    queryKey: ["questions-by-subject"],
    queryFn: () => getQuestionsBySubject(subjectId),
  });
};

export const useQuestionById = (questionId: string) => {
  return useQuery({
    queryKey: ["question-by-id"],
    queryFn: () => getQuestionById(questionId),
  });
};
