"use client";

import { useExams } from "@/server/backend/queries/examQueries";
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
import { useStudents } from "@/server/backend/queries/studentQueries";
import { StudentExt } from "@/server/db/schema/students";

interface Props {
  setSelectedStudent: (student: StudentExt | null) => void;
}

const StudentSelector = ({ setSelectedStudent }: Props) => {
  const [open, setOpen] = useState(false);
  const { data: students, isPending } = useStudents();
  const [value, setValue] = useState("");

  if (isPending) {
    return <Loader2 className="animate-spin" />;
  }

  if (!students) {
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
            ? students.find((student) => student.id === value)?.name
            : "Select Student..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0">
        <Command>
          <CommandInput placeholder="Search framework..." />
          <CommandList>
            <CommandEmpty>No students found.</CommandEmpty>
            <CommandGroup>
              {students.map((student) => (
                <CommandItem
                  key={student.id}
                  value={student.id}
                  onSelect={(currentValue) => {
                    setValue(currentValue === value ? "" : currentValue);
                    // setSelectedStudent(
                    //   currentValue === value ? "" : currentValue
                    // );
                    const selectedStudent = students.find(
                      (student) => student.id === currentValue
                    );
                    setSelectedStudent(selectedStudent ?? null);
                    setOpen(false);
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      value === student.id ? "opacity-100" : "opacity-0"
                    )}
                  />
                  {student.name}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};
export default StudentSelector;
