import { AddQuestionTypeSchema } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import {
  addQuestionType,
  deleteQuestionType,
} from "../actions/questionTypeActions";

export const useAddQuestionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ type, subjectId }: { type: string; subjectId: string }) =>
      addQuestionType({
        type,
        subjectId,
      }),
    onSuccess: async (res) => {
      if (res.success) {
        toast.success(res.success);
        queryClient.invalidateQueries({ queryKey: ["question-types"] });
        queryClient.invalidateQueries({
          queryKey: ["question-type-subject-id"],
        });
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: (res) => {
      const err = res.message;
      toast.error(err);
    },
  });
};

export const useDeleteQuestionType = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (questionTypeId: string) => deleteQuestionType(questionTypeId),
    onSuccess: async (res) => {
      if (res.success) {
        toast.success(res.success);
        await queryClient.invalidateQueries({ queryKey: ["question-types"] });
      }
      if (res.error) {
        toast.error(res.error);
      }
    },
    onError: (res) => {
      const err = res.message;
      toast.error(err);
    },
  });
};
