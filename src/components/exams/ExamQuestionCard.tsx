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
import { StudentAnswer } from "@/server/db/schema/studentAnswers";
import Image from "next/image";

interface Props {
  question: Question;
  questionNumber: number;
  examId: string;
  role: string;
  answerExamQuestion?: (studentResponse: StudentResponse) => void;
  answer?: StudentAnswer;
  completed?: boolean;
}

const ExamQuestionCard = ({
  question,
  questionNumber,
  examId,
  answerExamQuestion,
  answer,
  role = "student",
  completed = false,
}: Props) => {
  const { mutate: removeQuestionFromExam } = useRemoveQuestionFromExam();

  const isAnswerCorrect = answer
    ? answer.questionAnswer === answer.studentAnswer
    : false;

  // console.log("answer", answer);

  return (
    <Card className="bg-transparent dark:border-primary/40">
      <CardContent className="p-0">
        <div className="flex flex-col hover:drop-shadow-xl relative">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center relative">
              <div className="bg-slate-200 dark:bg-slate-800 p-4 font-bold rounded-tl-lg rounded-bl-lg h-full flex items-center justify-center">
                {questionNumber}
              </div>

              {/* question */}
              <RadioGroup
                onValueChange={(value) => {
                  if (answerExamQuestion) {
                    answerExamQuestion({
                      questionId: question.id,
                      questionAnswer: question.answer,
                      studentAnswer: value,
                    });
                  }
                }}
              >
                <div className="flex flex-col gap-2 p-3">
                  {/* question body */}
                  <p className="line-clamp-3 tracking-wide font-sinhala text-xl">
                    {parse(question.body)}
                  </p>

                  {/* option-1 */}
                  <div className="flex items-center space-x-2 relative">
                    <RadioGroupItem
                      disabled={role === "admin"}
                      className="w-5 h-5"
                      value="option1"
                      id="option1"
                      {...(answer &&
                        answer.studentAnswer === "option1" && {
                          checked: true,
                        })}
                    />
                    <Label htmlFor="option1">
                      <p className="text-lg tracking-wide font-sinhala">
                        {question.option1}
                      </p>
                    </Label>

                    {!isAnswerCorrect &&
                      completed &&
                      answer &&
                      answer.questionAnswer === "option1" && (
                        <Image
                          className="absolute -top-3 -left-7"
                          src="/images/err-circle.png"
                          alt="wrong answer"
                          width={60}
                          height={60}
                        />
                      )}
                  </div>

                  {/* option-2 */}
                  <div className="flex items-center space-x-2 relative">
                    <RadioGroupItem
                      disabled={role === "admin"}
                      className="w-5 h-5"
                      value="option2"
                      id="option2"
                      {...(answer &&
                        answer.studentAnswer === "option2" && {
                          checked: true,
                        })}
                    />
                    <Label htmlFor="option2">
                      <p className="text-lg tracking-wide font-sinhala">
                        {question.option2}
                      </p>
                    </Label>

                    {!isAnswerCorrect &&
                      completed &&
                      answer &&
                      answer.questionAnswer === "option2" && (
                        <Image
                          className="absolute -top-3 -left-7"
                          src="/images/err-circle.png"
                          alt="wrong answer"
                          width={60}
                          height={60}
                        />
                      )}
                  </div>

                  {/* option-3 */}
                  <div className="flex items-center space-x-2 relative">
                    <RadioGroupItem
                      disabled={role === "admin"}
                      className="w-5 h-5"
                      value="option3"
                      id="option3"
                      {...(answer &&
                        answer.studentAnswer === "option3" && {
                          checked: true,
                        })}
                    />
                    <Label htmlFor="option3">
                      <p className="text-lg tracking-wide font-sinhala">
                        {question.option3}
                      </p>
                    </Label>

                    {!isAnswerCorrect &&
                      completed &&
                      answer &&
                      answer.questionAnswer === "option3" && (
                        <Image
                          className="absolute -top-3 -left-7"
                          src="/images/err-circle.png"
                          alt="wrong answer"
                          width={60}
                          height={60}
                        />
                      )}
                  </div>

                  {/* option-4 */}
                  <div className="flex items-center space-x-2 relative">
                    <RadioGroupItem
                      disabled={role === "admin"}
                      className="w-5 h-5"
                      value="option4"
                      id="option4"
                      {...(answer &&
                        answer.studentAnswer === "option4" && {
                          checked: true,
                        })}
                    />
                    <Label htmlFor="option4">
                      <p className="text-lg tracking-wide font-sinhala">
                        {question.option4}
                      </p>
                    </Label>

                    {!isAnswerCorrect &&
                      completed &&
                      answer &&
                      answer.questionAnswer === "option4" && (
                        <Image
                          className="absolute -top-3 -left-7"
                          src="/images/err-circle.png"
                          alt="wrong answer"
                          width={60}
                          height={60}
                        />
                      )}
                  </div>
                </div>
              </RadioGroup>

              {/* answer correctness */}
              {role !== "admin" && isAnswerCorrect && completed && (
                <Image
                  src="/images/check-icon.png"
                  alt="correct answer"
                  width={60}
                  height={60}
                />
              )}

              {role !== "admin" && !isAnswerCorrect && completed && (
                <Image
                  src="/images/cross-icon.png"
                  alt="wrong answer"
                  width={60}
                  height={60}
                />
              )}
            </div>
          </div>

          {/* delete question */}
          {role === "admin" && (
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
