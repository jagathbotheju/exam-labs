import { useQuery } from "@tanstack/react-query";
import {
  getExams,
  getExamById,
  getExamsBySubject,
  getStudentExams,
  getStudentExam,
  getStudentExamsPagination,
  getStudentExamsCount,
} from "../actions/examActions";

// export const useStudentExamsBySubject = ({
//   studentId,
//   subjectId,
// }: {
//   studentId: string;
//   subjectId: string;
// }) => {
//   return useQuery({
//     queryKey: ["student-exams-by-subject", studentId, subjectId],
//     queryFn: () => getStudentExamsBySubject({ studentId, subjectId }),
//   });
// };

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
    queryKey: ["student-exams", studentId],
    queryFn: () => getStudentExams(studentId),
  });
};

export const useStudentExamsPagination = ({
  studentId,
  page,
}: {
  studentId: string;
  page: number;
  pageSize?: number;
}) => {
  return useQuery({
    queryKey: ["student-exams", studentId, page],
    queryFn: () => getStudentExamsPagination({ studentId, page }),
  });
};

export const useStudentExamsCount = (studentId: string) => {
  return useQuery({
    queryKey: ["student-exams-count", studentId],
    queryFn: () => getStudentExamsCount(studentId),
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
    queryKey: ["exams-by-subject", subjectId],
    queryFn: () => getExamsBySubject(subjectId),
  });
};
