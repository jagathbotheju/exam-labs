import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addQuestion,
  addQuestionToExam,
  deleteQuestion,
} from "../actions/questionActions";
import { AddMcqQuestionSchema } from "@/lib/schema";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useAddQuestionToExam = () => {
  return useMutation({
    mutationFn: ({
      examId,
      questionId,
    }: {
      examId: string;
      questionId: string;
    }) => addQuestionToExam({ examId, questionId }),
    onSuccess: (res) => {
      console.log(res);
      if (res.success) {
        toast.success(res.success);
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: (res) => {
      console.log(res);
      toast.error("Question could not be deleted to the Exam");
    },
  });
};

export const useDeleteQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (questionId: string) => deleteQuestion(questionId),
    onSuccess: (res) => {
      const message = res?.success;
      toast.success(message);
      queryClient.invalidateQueries({ queryKey: ["questions-by-subject"] });
    },
    onError: (res) => {
      toast.error("Question could not be deleted");
    },
  });
};

export const useAddQuestion = () => {
  const router = useRouter();

  return useMutation({
    mutationFn: ({
      questionData,
      questionId,
    }: {
      questionData: z.infer<typeof AddMcqQuestionSchema>;
      questionId?: string;
    }) => addQuestion({ questionData, questionId }),
    onSuccess: (res) => {
      const message = res.success;
      toast.success(message);
      router.push("/admin/questions");
    },
    onError: (res) => {
      const err = res.message;
      toast.error(err);
    },
  });
};
