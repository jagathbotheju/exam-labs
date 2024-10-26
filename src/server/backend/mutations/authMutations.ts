import { LoginSchema, RegisterSchema } from "@/lib/schema";
import { useMutation } from "@tanstack/react-query";
import { z } from "zod";
import { emailSignIn, registerUser } from "../actions/authActions";
import { toast } from "sonner";

export const useRegisterUser = () => {
  return useMutation({
    mutationFn: ({ formData }: { formData: z.infer<typeof RegisterSchema> }) =>
      registerUser({ formData }),
    onSuccess: async (res) => {
      if (res.success) {
        toast.success(res.success);
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

export const useEmailSignIn = () => {
  return useMutation({
    mutationFn: (formData: z.infer<typeof LoginSchema>) =>
      emailSignIn(formData),
    onSuccess: async (res) => {
      if (res.success) {
        toast.success(res.success);
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
