import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addQuestion,
  addQuestionToExam,
  answerQuestion,
  deleteQuestion,
  removeQuestionFromExam,
} from "../actions/questionActions";
import { AddMcqQuestionSchema } from "@/lib/schema";
import { z } from "zod";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export const useAnswerQuestion = () => {
  return useMutation({
    mutationFn: ({
      examId,
      studentId,
      questionId,
      questionTypeId,
      studentAnswer,
      questionAnswer,
    }: {
      examId: string;
      studentId: string;
      questionId: string;
      questionTypeId: string | null;
      studentAnswer: string;
      questionAnswer: string;
    }) =>
      answerQuestion({
        examId,
        studentId,
        questionId,
        questionTypeId,
        studentAnswer,
        questionAnswer,
      }),
  });
};

export const useAddQuestionToExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      questionId,
      questionNumber,
    }: {
      examId: string;
      questionId: string;
      questionNumber: number;
    }) => addQuestionToExam({ examId, questionId, questionNumber }),
    onSuccess: (res) => {
      console.log(res);
      if (res.success) {
        queryClient.invalidateQueries({ queryKey: ["questions-by-subject"] });
        toast.success(res.success);
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: (res) => {
      console.log(res);
      toast.error("Question could not be add to the Exam");
    },
  });
};

export const useRemoveQuestionFromExam = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      examId,
      questionId,
    }: {
      examId: string;
      questionId: string;
    }) => removeQuestionFromExam({ examId, questionId }),
    onSuccess: (res) => {
      if (res.success) {
        toast.success(res.success);
        queryClient.invalidateQueries({
          queryKey: ["exam-by-id"],
        });
        queryClient.invalidateQueries({
          queryKey: ["questions-by-subject"],
        });
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: (res) => {
      console.log(res);
      toast.error("Question could not be deleted from the Exam");
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
    },
    onError: (res) => {
      const err = res.message;
      toast.error(err);
    },
  });
};
