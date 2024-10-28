import { ProfileSchema } from "@/lib/schema";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { z } from "zod";
import { updateProfile } from "../actions/studentActions";

export const useUpdateProfile = () => {
  return useMutation({
    mutationFn: ({
      formData,
      studentId,
    }: {
      formData: z.infer<typeof ProfileSchema>;
      studentId: string;
    }) => updateProfile({ formData, studentId }),
    onSuccess: () => {
      toast.success("Profile updated successfully");
    },
  });
};
