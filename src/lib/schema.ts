import { z } from "zod";

export const AddMcqQuestionSchema = z.object({
  id: z.string().optional(),
  body: z.string().min(1, "question text is required"),
  option1: z.string().min(1, "option 1 is required"),
  option2: z.string().min(1, "option 2 is required"),
  option3: z.string().min(1, "option 3 is required"),
  option4: z.string().min(1, "option 4 is required"),
  grade: z.string().min(1, "please select grade"),
  term: z.string().min(1, "please select term"),
  // type: z.string().min(1, "please select question type"),
  subject: z.string({ required_error: "please select a subject" }),
  answer: z.string().min(1, "please select an Answer"),
});

export const AddSubjectSchema = z.object({
  title: z.string().min(1, "subject name is required"),
});
