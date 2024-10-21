import { AddExamSchema } from "@/lib/schema";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { addExam, deleteExam } from "../actions/examActions";
import { toast } from "sonner";

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
