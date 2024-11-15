import { useQuery } from "@tanstack/react-query";
import {
  getQuestionTypeById,
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
