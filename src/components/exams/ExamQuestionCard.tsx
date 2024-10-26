"use client";
import { Question } from "@/server/db/schema/questions";
import { Card, CardContent } from "../ui/card";
import parse from "html-react-parser";
import { Trash2 } from "lucide-react";
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

interface Props {
  question: Question;
  index: number;
  examId: string;
}

const ExamQuestionCard = ({ question, index, examId }: Props) => {
  const { mutate: removeQuestionFromExam } = useRemoveQuestionFromExam();

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col hover:drop-shadow-xl relative">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="bg-slate-200 p-4 font-bold rounded-tl-lg rounded-bl-lg h-full flex items-center justify-center">
                {index}
              </div>

              {/* question */}
              <div className="flex flex-col gap-2 p-3">
                <p className="line-clamp-3 tracking-widest text-sm underline underline-offset-2">
                  {parse(question.body)}
                </p>
                <p className="text-xs">{question.option1}</p>
                <p className="text-xs">{question.option2}</p>
                <p className="text-xs">{question.option3}</p>
                <p className="text-xs">{question.option4}</p>
              </div>
            </div>
          </div>

          {/* delete question */}
          <AlertDialog>
            <AlertDialogTrigger>
              <Trash2 className="absolute w-5 h-5 right-4 bottom-4 text-red-500 cursor-pointer hover:text-red-800" />
            </AlertDialogTrigger>
            <AlertDialogContent aria-describedby="delete question">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="flex flex-col gap-1">
                  <span>This action cannot be undone.</span>
                  <span>This will remove delete Question from this Exam.</span>
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
        </div>
      </CardContent>
    </Card>
  );
};
export default ExamQuestionCard;
