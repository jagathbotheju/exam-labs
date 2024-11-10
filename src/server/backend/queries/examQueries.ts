import { useQuery } from "@tanstack/react-query";
import {
  getExams,
  getExamById,
  getExamsBySubject,
  getStudentExams,
  getStudentExam,
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

export const useStudentExams = (studentId: string) => {
  return useQuery({
    queryKey: ["student-exams"],
    queryFn: () => getStudentExams(studentId),
  });
};

export const useStudentExam = ({
  studentId,
  examId,
}: {
  studentId: string;
  examId: string;
}) => {
  return useQuery({
    queryKey: ["student-exams"],
    queryFn: () => getStudentExam({ studentId, examId }),
  });
};

export const useExamsBySubject = (subjectId: string) => {
  return useQuery({
    queryKey: ["exams-by-subject"],
    queryFn: () => getExamsBySubject(subjectId),
  });
};
