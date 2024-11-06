import { useQuery } from "@tanstack/react-query";
import { getStudentAnswers } from "../actions/answerActions";

export const useStudentAnswers = ({
  examId,
  studentId,
}: {
  examId: string;
  studentId: string;
}) => {
  return useQuery({
    queryKey: ["student-answers"],
    queryFn: () => getStudentAnswers({ studentId, examId }),
  });
};
