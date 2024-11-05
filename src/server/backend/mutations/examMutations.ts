import { AddExamSchema } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import {
  addExam,
  addExamToStudent,
  deleteExam,
  deleteExamFromStudent,
} from "../actions/examActions";
import { toast } from "sonner";

export const useAddExamToStudent = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      studentId,
    }: {
      examId: string;
      studentId: string;
    }) => addExamToStudent({ examId, studentId }),
    onSuccess: (res) => {
      console.log(res);
      if (res.success) {
        // queryClient.invalidateQueries({ queryKey: ["questions-by-subject"] });
        toast.success(res.success);
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: (res) => {
      console.log(res);
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
      console.log(res);
      if (res.success) {
        toast.success(res.success);
        queryClient.invalidateQueries({ queryKey: ["student-exams"] });
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: (res) => {
      console.log(res);
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
      console.log(res);
      toast.error("Could not delete Exam MUTATE");
    },
  });
};
