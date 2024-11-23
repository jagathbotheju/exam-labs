"use client";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { z } from "zod";
import { AddQuestionTypeSchema, AddSubjectSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { useAddSubject } from "@/server/backend/mutations/subjectMutations";
import { Loader2 } from "lucide-react";
import { useSubjects } from "@/server/backend/queries/subjectQueries";
import { toast } from "sonner";
import { useAddQuestionType } from "@/server/backend/mutations/questionTypeMutations";
import { useQuestionTypes } from "@/server/backend/queries/questionTypeQueries";

const AddQuestionTypeForm = () => {
  const router = useRouter();
  const { data: questionTypes, isLoading } = useQuestionTypes();
  const { mutate: addQuestionType, isPending } = useAddQuestionType();
  const form = useForm<z.infer<typeof AddQuestionTypeSchema>>({
    resolver: zodResolver(AddQuestionTypeSchema),
    defaultValues: {
      type: "",
    },
    mode: "all",
  });

  const onSubmit = (formData: z.infer<typeof AddQuestionTypeSchema>) => {
    addQuestionType(formData);
    form.reset();
  };

  return (
    <div className="mt-2 w-full max-w-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {/* question type */}
          <FormField
            control={form.control}
            name="type"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Subject Name</FormLabel>
                <FormControl>
                  <Input {...field} className="uppercase font-sinhala" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 mt-8">
            <Button type="submit" className="inline-flex gap-2">
              {isPending && <Loader2 className="w-4 h-4" />}
              {isPending ? "Creating..." : "Create"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              type="button"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AddQuestionTypeForm;
