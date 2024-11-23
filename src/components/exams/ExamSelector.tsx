"use client";

import {
  useExams,
  useExamsBySubject,
} from "@/server/backend/queries/examQueries";
import { Check, ChevronsUpDown, Loader2 } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { useState } from "react";
import { Button } from "../ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import { cn } from "@/lib/utils";

interface Props {
  setExam: (exam: string) => void;
  subjectId: string;
}

const ExamSelector = ({ setExam, subjectId }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  // const { data: exams, isPending } = useExams();
  const { data: examsBySubject, isPending } = useExamsBySubject(subjectId);

  if (isPending) {
    return <Loader2 className="animate-spin" />;
  }

  if (!examsBySubject) {
    return <p className="text-xl font-semibold">No Exams Found!</p>;
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[200px] justify-between"
        >
          {value
            ? examsBySubject.find((exam) => exam.id === value)?.name
            : "Select an Exam..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No framework found.</CommandEmpty>
            <CommandGroup>
              {examsBySubject.map((exam) => (
                <CommandItem
                  key={exam.id}
                  value={exam.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    setExam(currentValue === value ? "" : currentValue);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === exam.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {exam.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default ExamSelector;
