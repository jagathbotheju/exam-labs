import { useQuery } from "@tanstack/react-query";
import { getQuestionTypes } from "../actions/questionTypeActions";

export const useQuestionTypes = () => {
  return useQuery({
    queryKey: ["question-types"],
    queryFn: () => getQuestionTypes(),
  });
};
