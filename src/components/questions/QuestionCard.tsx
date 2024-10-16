"use client";
import { Question } from "@/server/db/schema/questions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import { useDeleteQuestion } from "@/server/backend/mutations/questionMutations";
import parse from "html-react-parser";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";

interface Props {
  question: Question;
  index: number;
}

const QuestionCard = ({ question, index }: Props) => {
  const { mutate } = useDeleteQuestion();

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col hover:drop-shadow-xl">
          <div className="flex justify-between">
            <Link href={`/admin/questions/mcq/${question.id}`}>
              <div className="flex gap-2">
                <div className="bg-slate-200 p-4 font-bold rounded-tl-lg rounded-bl-lg">
                  {index}
                </div>
                <p className="line-clamp-3">{parse(question.body)}</p>
              </div>
            </Link>
            <div className="p-4 flex flex-col justify-center bg-red-50 overflow-hidden rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-red-100">
              <AlertDialog>
                <AlertDialogTrigger>
                  <Trash2 className="w-4 h-4 text-red-500" />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you absolutely sure?
                    </AlertDialogTitle>
                    <AlertDialogDescription className="flex flex-col gap-1">
                      <span>This action cannot be undone.</span>
                      <span>This will permanently delete this Question.</span>
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => mutate(question.id)}>
                      Delete
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
export default QuestionCard;
