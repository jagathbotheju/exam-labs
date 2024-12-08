import { useQuery } from "@tanstack/react-query";
import {
  getQuestionTypeById,
  getQuestionTypeBySubjectId,
  getQuestionTypes,
} from "../actions/questionTypeActions";

export const useQuestionTypes = () => {
  return useQuery({
    queryKey: ["question-types"],
    queryFn: () => getQuestionTypes(),
  });
};

export const useQuestionTypeById = (questionTypeId: string) => {
  return useQuery({
    queryKey: ["question-type-id"],
    queryFn: () => getQuestionTypeById(questionTypeId),
  });
};

export const useQuestionTypeBySubjectId = (subjectId: string) => {
  return useQuery({
    queryKey: ["question-type-subject-id", subjectId],
    queryFn: () => getQuestionTypeBySubjectId(subjectId),
  });
};
