"use client";
import { useState } from "react";
import { AddExamSchema } from "@/lib/schema";
import { useSubjects } from "@/server/backend/queries/subjectQueries";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "../ui/form";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { useAddExam } from "@/server/backend/mutations/examMutations";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";

const AddExamForm = () => {
  const router = useRouter();
  const [openSubject, setOpenSubject] = useState(false);
  const { data: subjects } = useSubjects();
  const { mutate, isPending } = useAddExam();
  const form = useForm<z.infer<typeof AddExamSchema>>({
    resolver: zodResolver(AddExamSchema),
    defaultValues: {
      name: "",
      subject: "",
      duration: 0,
    },
    mode: "all",
  });

  const onSubmit = (examData: z.infer<typeof AddExamSchema>) => {
    mutate({ examData });
    form.reset();
  };

  return (
    <div className="mt-2 w-full max-w-xl">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                          "w-[200px] justify-between dark:bg-transparent",
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
                    <Command className="">
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

          {/* name */}
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Exam Name</FormLabel>
                <FormControl>
                  <Input {...field} className="uppercase" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* duration */}
          <FormField
            control={form.control}
            name="duration"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duration (minutes)</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="flex gap-2 mt-8">
            <Button
              disabled={!form.formState.isValid}
              type="submit"
              className="inline-flex gap-2"
            >
              {isPending && <Loader2 className="w-4 h-4" />}
              {isPending ? "Creating..." : "Create"}
            </Button>
            <Button
              variant="outline"
              onClick={() => router.back()}
              type="button"
              className="dark:bg-transparent"
            >
              Cancel
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};
export default AddExamForm;
