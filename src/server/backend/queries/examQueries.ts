import { useQuery } from "@tanstack/react-query";
import {
  getExams,
  getExamById,
  getExamsBySubject,
} from "../actions/examActions";

export const useExamById = (examId: string) => {
  return useQuery({
    queryKey: ["exam-by-id"],
    queryFn: () => getExamById(examId),
  });
};

export const useExams = () => {
  return useQuery({
    queryKey: ["exams"],
    queryFn: () => getExams(),
  });
};

export const useExamsBySubject = (subjectId: string) => {
  return useQuery({
    queryKey: ["exams-by-subject"],
    queryFn: () => getExamsBySubject(subjectId),
  });
};
