"use client";
import { useSubjects } from "@/server/backend/queries/subjectQueries";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
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
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  setSubject: (subject: string) => void;
  subjectId?: string;
}

const SubjectSelector = ({ setSubject, subjectId }: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const { data: subjects } = useSubjects();

  useEffect(() => {
    if (subjectId) {
      setValue(subjectId);
    }
  }, [subjectId]);

  return (
    <div>
      {subjects && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="dark:bg-slate-900 bg-slate-50">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between"
            >
              {value
                ? subjects.find((subject) => subject.id === value)?.title
                : "Select a subject..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 dark:bg-slate-900">
            <Command className="dark:bg-slate-900">
              <CommandInput placeholder="Search subjects..." />
              <CommandList>
                <CommandEmpty>No subjects found.</CommandEmpty>
                <CommandGroup>
                  {subjects.map((subject) => (
                    <CommandItem
                      key={subject.id}
                      value={subject.id}
                      onSelect={(currentValue) => {
                        setValue(currentValue === value ? "" : currentValue);
                        setSubject(currentValue === value ? "" : currentValue);
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === subject.id ? "opacity-100" : "opacity-0"
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
      )}
    </div>
  );
};
export default SubjectSelector;
