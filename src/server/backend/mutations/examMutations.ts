import { AddExamSchema } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  addExam,
  addExamToStudent,
  cancelStudentExam,
  deleteExam,
  deleteExamFromStudent,
  completeExam,
} from "../actions/examActions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useCompleteExam = () => {
  return useMutation({
    mutationFn: ({
      examId,
      subjectId,
      studentId,
      completedAt,
      marks,
      duration,
    }: {
      examId: string;
      subjectId: string;
      studentId: string;
      completedAt: string;
      marks: number;
      duration: number;
    }) =>
      completeExam({
        examId,
        subjectId,
        studentId,
        completedAt,
        marks,
        duration,
      }),
  });
};

export const useCancelStudentExam = () => {
  return useMutation({
    mutationFn: ({
      examId,
      studentId,
    }: {
      examId: string;
      studentId: string;
    }) => cancelStudentExam({ examId, studentId }),
    onSuccess: (res) => {
      if (res.success) {
        // queryClient.invalidateQueries({ queryKey: ["questions-by-subject"] });
        toast.success(res.success);
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: (res) => {
      toast.error("Exam could not be assign to Student");
    },
  });
};

export const useAddExamToStudent = () => {
  const queryClient = useQueryClient();
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      examId,
      studentId,
    }: {
      examId: string;
      studentId: string;
    }) => addExamToStudent({ examId, studentId }),
    onSuccess: (res) => {
      if (res.success) {
        // queryClient.invalidateQueries({ queryKey: ["questions-by-subject"] });
        router.back();
        toast.success(res.success);
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: (res) => {
      toast.error("Exam could not be assign to Student");
    },
  });
};

export const useDeleteExamFromStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      studentId,
    }: {
      examId: string;
      studentId: string;
    }) => deleteExamFromStudent({ examId, studentId }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        queryClient.invalidateQueries({ queryKey: ["student-exams"] });
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: (res) => {
      toast.error("Exam could not be assign to Student");
    },
  });
};

export const useAddExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ examData }: { examData: z.infer<typeof AddExamSchema> }) =>
      addExam({ examData }),
    onSuccess: async (res) => {
      const message = res?.success;
      toast.success(message);
      await queryClient.invalidateQueries({ queryKey: ["exams"] });
    },
    onError: (res) => {
      const err = res.message;
      toast.error(err);
    },
  });
};

export const useDeleteExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (examId: string) => deleteExam(examId),
    onSuccess: async (res) => {
      if (res.success) {
        await queryClient.invalidateQueries({ queryKey: ["exams"] });
        return toast.success(res.success);
      }
      if (res.error) {
        return toast.error(res.error);
      }
    },
    onError: (res) => {
      toast.error("Could not delete Exam MUTATE");
    },
  });
};
