import { useQuery } from "@tanstack/react-query";
import { emailSignIn } from "../actions/authActions";
import { z } from "zod";
import { LoginSchema } from "@/lib/schema";

export const useEmailSignIn = (formData: z.infer<typeof LoginSchema>) => {
  return useQuery({
    queryKey: ["email-sign-in"],
    queryFn: () => emailSignIn(formData),
  });
};
