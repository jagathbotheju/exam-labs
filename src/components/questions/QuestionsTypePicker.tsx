"use client";
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
import {
  useQuestionTypeBySubjectId,
  useQuestionTypes,
} from "@/server/backend/queries/questionTypeQueries";
import { QuestionType } from "@/server/db/schema/questionTypes";

interface Props {
  setQuestionType: (type: QuestionType) => void;
  questionType: QuestionType | undefined;
  subjectId: string;
}

const QuestionsTypePicker = ({
  setQuestionType,
  questionType,
  subjectId,
}: Props) => {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  // const { data: questionTypes } = useQuestionTypes();
  const { data: questionTypes } = useQuestionTypeBySubjectId(subjectId);

  // useEffect(() => {
  //   if (questionType) {
  //     setValue(questionType.id);
  //   }
  // }, [questionType]);

  // console.log("value", value);

  return (
    <div>
      {questionTypes && (
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild className="dark:bg-slate-900 bg-slate-50">
            <Button
              variant="outline"
              role="combobox"
              aria-expanded={open}
              className="w-[200px] justify-between font-sinhala"
            >
              {value === "all"
                ? "All"
                : questionTypes.find((type) => type.id === value)?.type
                ? questionTypes.find((type) => type.id === value)?.type
                : "filter with types..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-[200px] p-0 dark:bg-slate-900">
            <Command className="dark:bg-slate-900">
              <CommandInput placeholder="Search subjects..." />
              <CommandList>
                <CommandEmpty>No subjects found.</CommandEmpty>
                <CommandGroup>
                  {/* all types */}
                  <CommandItem
                    className="font-sinhala"
                    value="all"
                    onSelect={(currentValue) => {
                      const selectedType = questionTypes.find(
                        (item) => item.id === currentValue
                      );
                      setValue(currentValue);
                      setQuestionType(selectedType ?? ({} as QuestionType));
                      setOpen(false);
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        value === "all" ? "opacity-100" : "opacity-0"
                      )}
                    />
                    All
                  </CommandItem>

                  {questionTypes.map((type) => (
                    <CommandItem
                      className="font-sinhala"
                      key={type.id}
                      value={type.id}
                      onSelect={(currentValue) => {
                        const selectedType = questionTypes.find(
                          (item) => item.id === currentValue
                        );
                        setValue(currentValue);
                        setQuestionType(selectedType ?? ({} as QuestionType));
                        setOpen(false);
                      }}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          value === type.id ? "opacity-100" : "opacity-0"
                        )}
                      />
                      {type.type}
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
export default QuestionsTypePicker;
