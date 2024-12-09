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
import {
  useQuestionTypeBySubjectId,
  useQuestionTypes,
} from "@/server/backend/queries/questionTypeQueries";
import ImageUpload from "../ImageUpload";
import { useUploadThing } from "@/lib/uploadthing";

interface Props {
  questionId?: string;
}

const AddMcqQuestionForm = ({ questionId }: Props) => {
  const router = useRouter();
  const [subjectId, setSubjectId] = useState("");

  const { data: subjects } = useSubjects();
  const { mutate: addQuestion, isPending } = useAddQuestion();

  const [openSubject, setOpenSubject] = useState(false);
  const [openType, setOpenType] = useState(false);
  const [openGrade, setOpenGrade] = useState(false);
  const [openTerm, setOpenTerm] = useState(false);
  const [openAnswer, setOpenAnswer] = useState(false);

  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

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
      subject: "",
      type: "",
      answer: "",
      image: "",
    },
    mode: "all",
  });

  const { data: types, isLoading: isLoadingTypes } = useQuestionTypeBySubjectId(
    form.getValues("subject")
  );
  const { data: question } = useQuestionById(questionId ?? "");

  useEffect(() => {
    form.reset();

    if (question && !_.isEmpty(question)) {
      form.setValue("grade", question[0].grade);
      form.setValue("term", question[0].term);
      form.setValue("subject", question[0].subjectId);
      form.setValue("type", question[0].typeId);
      form.setValue("body", question[0].body);
      form.setValue("option1", question[0].option1 ?? "");
      form.setValue("option2", question[0].option2 ?? "");
      form.setValue("option3", question[0].option3 ?? "");
      form.setValue("option4", question[0].option4 ?? "");
      form.setValue("answer", question[0].answer);
      form.setValue("image", question[0].image ?? "");
    }
  }, [question, form]);

  const onSubmit = (questionData: z.infer<typeof AddMcqQuestionSchema>) => {
    addQuestion({ questionData, questionId });
    router.push(`/admin/questions?subjectId=${form.getValues("subject")}`);
  };

  return (
    <div className="mt-2 w-full flex flex-col gap-4 dark:bg-slate-900 bg-slate-50">
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
                    <PopoverTrigger asChild className="dark:bg-slate-900">
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
                    <PopoverContent className="w-[200px] p-0 dark:bg-slate-900">
                      <Command className="dark:bg-slate-900">
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
                    <PopoverTrigger asChild className="dark:bg-slate-900">
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
                    <PopoverContent className="w-[200px] p-0 bg-slate-900">
                      <Command className="dark:bg-slate-900">
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
                    <PopoverTrigger asChild className="dark:bg-slate-900">
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
                    <PopoverContent className="w-[200px] p-0 dark:bg-slate-900">
                      <Command className="dark:bg-slate-900">
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

            {/* type */}
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Type</FormLabel>
                  <Popover open={openType} onOpenChange={setOpenType}>
                    <PopoverTrigger asChild className="dark:bg-slate-900">
                      <FormControl>
                        <Button
                          variant="outline"
                          role="combobox"
                          className={cn(
                            "w-[200px] justify-between font-sinhala",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value
                            ? types?.find((item) => item.id === field.value)
                                ?.type
                            : "Select Type"}
                          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-[200px] p-0 dark:bg-slate-900">
                      <Command className="dark:bg-slate-900">
                        <CommandInput placeholder="Search subjects..." />
                        <CommandList>
                          <CommandEmpty>No types found.</CommandEmpty>
                          <CommandGroup>
                            {types?.map((item) => (
                              <CommandItem
                                className="font-sinhala"
                                key={item.id}
                                value={item.type}
                                onSelect={() => {
                                  form.setValue("type", item.id);
                                  setOpenType(false);
                                  form.trigger("type");
                                }}
                              >
                                <Check
                                  className={cn(
                                    "mr-2 h-4 w-4",
                                    item.id === field.value
                                      ? "opacity-100"
                                      : "opacity-0"
                                  )}
                                />
                                {item.type}
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

          <div className="flex justify-between gap-5">
            {/* question body */}
            <FormField
              control={form.control}
              name="body"
              render={({ field }) => (
                <FormItem className="flex flex-col w-full h-[300]">
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <div className="w-full h-full">
                      <TipTap value={field.value} className="h-[240px]" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* image */}
            <FormField
              control={form.control}
              name="image"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      onChange={(url) => field.onChange(url)}
                      setFiles={setFiles}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>

          {/* option-1 */}
          <FormField
            control={form.control}
            name="option1"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Option 1</FormLabel>
                <FormControl>
                  <Textarea {...field} className="tracking-wide font-sinhala" />
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
                  <Textarea {...field} className="tracking-wide font-sinhala" />
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
                  <Textarea {...field} className="tracking-wide font-sinhala" />
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
                  <Textarea {...field} className="tracking-wide font-sinhala" />
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
                  <PopoverTrigger asChild className="dark:bg-slate-900">
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
                  <PopoverContent className="w-[200px] p-0 dark:bg-slate-900">
                    <Command className="dark:bg-slate-900">
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
              {isPending && <Loader2 className="w-4 h-4 animate-spin" />}
            </Button>
            <Button
              className="dark:bg-slate-900"
              onClick={() => {
                router.push(
                  `/admin/questions?subjectId=${form.getValues("subject")}`
                );
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
