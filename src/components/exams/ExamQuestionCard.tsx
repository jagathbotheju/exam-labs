"use client";
import { Question } from "@/server/db/schema/questions";
import { Card, CardContent } from "../ui/card";
import parse from "html-react-parser";
import { ArrowBigUp, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../ui/alert-dialog";
import { AlertDialogTrigger } from "@radix-ui/react-alert-dialog";
import { useRemoveQuestionFromExam } from "@/server/backend/mutations/questionMutations";
import { Student } from "@/server/db/schema/students";
import { Checkbox } from "../ui/checkbox";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { useState } from "react";
import { StudentResponse } from "@/lib/types";

interface Props {
  question: Question;
  questionNumber: number;
  index: number;
  examId: string;
  student: Student;
  answers: StudentResponse[];
  setAnswers: (answer: StudentResponse[]) => void;
}

const ExamQuestionCard = ({
  question,
  questionNumber,
  index,
  examId,
  student,
  setAnswers,
  answers,
}: Props) => {
  const { mutate: removeQuestionFromExam } = useRemoveQuestionFromExam();

  // console.log("question", question);

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col hover:drop-shadow-xl relative">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="bg-slate-200 p-4 font-bold rounded-tl-lg rounded-bl-lg h-full flex items-center justify-center">
                {questionNumber}
              </div>

              {/* question */}
              <RadioGroup
                onValueChange={(value) =>
                  setAnswers([
                    ...answers,
                    {
                      questionId: question.id,
                      answerOption: question.answer,
                      studentOption: value,
                      questionNumber,
                    },
                  ])
                }
              >
                <div className="flex flex-col gap-2 p-3">
                  {/* question body */}
                  <p className="line-clamp-3 tracking-wide font-sinhala text-xl">
                    {parse(question.body)}
                  </p>

                  {/* option-1 */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      className="w-5 h-5"
                      value="option1"
                      id="option1"
                    />
                    <Label htmlFor="option1">
                      <p className="text-lg tracking-wide font-sinhala">
                        {question.option1}
                      </p>
                    </Label>
                  </div>

                  {/* option-2 */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      className="w-5 h-5"
                      value="option2"
                      id="option2"
                    />
                    <Label htmlFor="option2">
                      <p className="text-lg tracking-wide font-sinhala">
                        {question.option2}
                      </p>
                    </Label>
                  </div>

                  {/* option-3 */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      className="w-5 h-5"
                      value="option3"
                      id="option3"
                    />
                    <Label htmlFor="option3">
                      <p className="text-lg tracking-wide font-sinhala">
                        {question.option3}
                      </p>
                    </Label>
                  </div>

                  {/* option-4 */}
                  <div className="flex items-center space-x-2">
                    <RadioGroupItem
                      className="w-5 h-5"
                      value="option4"
                      id="option4"
                    />
                    <Label htmlFor="option4">
                      <p className="text-lg tracking-wide font-sinhala">
                        {question.option4}
                      </p>
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>

          {/* delete question */}
          {student && student.role === "admin" && (
            <AlertDialog>
              <AlertDialogTrigger>
                <Trash2 className="absolute w-5 h-5 right-4 bottom-4 text-red-500 cursor-pointer hover:text-red-800" />
              </AlertDialogTrigger>
              <AlertDialogContent aria-describedby="delete question">
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className="flex flex-col gap-1">
                    <span>This action cannot be undone.</span>
                    <span>
                      This will remove delete Question from this Exam.
                    </span>
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    className="bg-red-500"
                    onClick={() =>
                      removeQuestionFromExam({
                        questionId: question.id,
                        examId: examId,
                      })
                    }
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
export default ExamQuestionCard;
