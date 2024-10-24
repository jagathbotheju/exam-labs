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
import { AddMcqQuestionSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { Textarea } from "../ui/textarea";
import { Badge } from "../ui/badge";
import { useSubjects } from "@/server/backend/queries/subjectQueries";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { answersMcq, grades, terms, types } from "@/lib/constants";
import { useAddQuestion } from "@/server/backend/mutations/questionMutations";
import { useQuestionById } from "@/server/backend/queries/questionQueries";
import TipTap from "../Tiptap";
import _ from "lodash";

interface Props {
  questionId?: string;
}

const AddMcqQuestionForm = ({ questionId }: Props) => {
  const router = useRouter();
  const { data: subjects } = useSubjects();
  const [openSubject, setOpenSubject] = useState(false);
  const [openGrade, setOpenGrade] = useState(false);
  const [openTerm, setOpenTerm] = useState(false);
  const [openAnswer, setOpenAnswer] = useState(false);
  const { mutate: addQuestion, isPending } = useAddQuestion();
  const form = useForm<z.infer<typeof AddMcqQuestionSchema>>({
    resolver: zodResolver(AddMcqQuestionSchema),
    defaultValues: {
      body: "",
      option1: "",
      option2: "",
      option3: "",
      option4: "",
      grade: "",
      term: "",
      answer: "",
      subject: "",
    },
    mode: "all",
  });

  const { data: question } = useQuestionById(questionId ?? "");

  useEffect(() => {
    form.reset();
    if (question && !_.isEmpty(question)) {
      form.setValue("grade", question[0].grade);
      form.setValue("term", question[0].term);
      form.setValue("subject", question[0].subjectId);
      form.setValue("body", question[0].body);
      form.setValue("option1", question[0].option1);
      form.setValue("option2", question[0].option2);
      form.setValue("option3", question[0].option3);
      form.setValue("option4", question[0].option4);
      form.setValue("answer", question[0].answer);
    }
  }, [question, form]);

  const onSubmit = (questionData: z.infer<typeof AddMcqQuestionSchema>) => {
    addQuestion({ questionData, questionId });
    form.reset();
  };

  return (
    <div className="mt-2 w-full flex flex-col gap-4">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="flex gap-5 items-center w-full">
            {/* grade */}
            <FormField
              control={form.control}
              name="grade"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Grade</FormLabel>
                  <Popover open={openGrade} onOpenChange={setOpenGrade}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? grades?.find((grade) => grade === field.value)
                            : "Select grade"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search subjects..." />
                        <CommandList>
                          <CommandEmpty>No grades found.</CommandEmpty>
                          <CommandGroup>
                            {grades?.map((grade) => (
                              <CommandItem
                                key={grade}
                                value={grade}
                                onSelect={() => {
                                  form.setValue("grade", grade);
                                  setOpenGrade(false);
                                  form.trigger("grade");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    grade === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {grade}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* term */}
            <FormField
              control={form.control}
              name="term"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Term</FormLabel>
                  <Popover open={openTerm} onOpenChange={setOpenTerm}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? terms?.find((term) => term === field.value)
                            : "Select grade"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search subjects..." />
                        <CommandList>
                          <CommandEmpty>No terms found.</CommandEmpty>
                          <CommandGroup>
                            {terms?.map((term) => (
                              <CommandItem
                                key={term}
                                value={term}
                                onSelect={() => {
                                  form.setValue("term", term);
                                  setOpenTerm(false);
                                  form.trigger("term");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    term === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {term}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* subject */}
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Subject</FormLabel>
                  <Popover open={openSubject} onOpenChange={setOpenSubject}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? subjects?.find(
                                (subject) => subject.id === field.value
                              )?.title
                            : "Select subject"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0">
                      <Command>
                        <CommandInput placeholder="Search subjects..." />
                        <CommandList>
                          <CommandEmpty>No subject found.</CommandEmpty>
                          <CommandGroup>
                            {subjects?.map((subject) => (
                              <CommandItem
                                key={subject.id}
                                value={subject.title}
                                onSelect={() => {
                                  form.setValue("subject", subject.id);
                                  setOpenSubject(false);
                                  form.trigger("subject");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    subject.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {subject.title}
                              </CommandItem>
                            ))}
                          </CommandGroup>
                        </CommandList>
                      </Command>
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          {/* question body */}
          <FormField
            control={form.control}
            name="body"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Question Text</FormLabel>
                <FormControl>
                  {/* <Textarea {...field} className="h-[150px]" /> */}
                  <TipTap value={field.value} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* option-1 */}
          <FormField
            control={form.control}
            name="option1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option 1</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* option-2 */}
          <FormField
            control={form.control}
            name="option2"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option 2</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* option-3 */}
          <FormField
            control={form.control}
            name="option3"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option 3</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* option-4 */}
          <FormField
            control={form.control}
            name="option4"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option 4</FormLabel>
                <FormControl>
                  <Textarea {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* answer */}
          <FormField
            control={form.control}
            name="answer"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Answer</FormLabel>
                <Popover open={openAnswer} onOpenChange={setOpenAnswer}>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant="outline"
                        role="combobox"
                        className={cn(
                          "w-[200px] justify-between",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value
                          ? answersMcq?.find(
                              (answer) => answer.value === field.value
                            )?.label
                          : "Select answer"}
                        <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-[200px] p-0">
                    <Command>
                      <CommandInput placeholder="Search answers..." />
                      <CommandList>
                        <CommandEmpty>No grades found.</CommandEmpty>
                        <CommandGroup>
                          {answersMcq?.map((answer) => (
                            <CommandItem
                              key={answer.value}
                              value={answer.label}
                              onSelect={(currentValue) => {
                                form.setValue("answer", answer.value);
                                setOpenAnswer(false);
                                form.trigger("answer");
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  answer.value === field.value
                                    ? "opacity-100"
                                    : "opacity-0"
                                )}
                              />
                              {answer.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="mt-8 flex gap-2">
            <Button type="submit">
              {questionId ? "Update" : isPending ? "Creating..." : "Create"}
              {isPending && <Loader2 className="w-4 h-4" />}
            </Button>
            <Button
              onClick={() => {
                router.back();
                form.reset();
              }}
              type="button"
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AddMcqQuestionForm;
