"use client";
import { Question } from "@/server/db/schema/questions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import { Edit2, FilePenLine, FilePlus, Router, Trash2 } from "lucide-react";
import {
  useAddQuestionToExam,
  useDeleteQuestion,
} from "@/server/backend/mutations/questionMutations";
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
import { useRouter } from "next/navigation";
import ExamSelector from "../exams/ExamSelector";
import { useState } from "react";
import { toast } from "sonner";

interface Props {
  question: Question;
  index: number;
}

const QuestionCard = ({ question, index }: Props) => {
  const router = useRouter();
  const { mutate } = useDeleteQuestion();
  const [exam, setExam] = useState("");
  const { mutate: addQuestion } = useAddQuestionToExam();

  const addQuestionToExam = () => {
    console.log("adding question", question.id);
    console.log("adding to exam", exam);
    if (exam && question.id) {
      addQuestion({
        questionId: question.id,
        examId: exam,
      });
    } else {
      return toast.error("Unable to Add, not enough data...");
    }
  };

  return (
    <Card>
      <CardContent className="p-0">
        <div className="flex flex-col hover:drop-shadow-xl">
          <div className="flex justify-between">
            <div className="flex gap-2 items-center">
              <div className="bg-slate-200 p-4 font-bold rounded-tl-lg rounded-bl-lg">
                {index}
              </div>
              <p className="line-clamp-3 tracking-widest">
                {parse(question.body)}
              </p>
            </div>

            {/* actions */}
            <div className="flex items-center">
              {/* add to exam */}
              <div className="bg-blue-50 h-full px-4 flex items-center hover:bg-blue-200 cursor-pointer">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <FilePlus className="text-blue-600" />
                  </AlertDialogTrigger>
                  <AlertDialogContent aria-describedby="add question to exam">
                    <AlertDialogTitle className="flex justify-between">
                      Add Question to Exam
                      <ExamSelector setExam={setExam} />
                    </AlertDialogTitle>
                    <div className="flex flex-col gap-2">
                      <p className="text-sm">{parse(question.body)}</p>
                      <p className="text-xs">{question.option1}</p>
                      <p className="text-xs">{question.option2}</p>
                      <p className="text-xs">{question.option3}</p>
                      <p className="text-xs">{question.option4}</p>
                    </div>

                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        disabled={!exam}
                        onClick={addQuestionToExam}
                      >
                        Add
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              {/* edit */}
              <div className="bg-green-50 h-full px-4 flex items-center hover:bg-green-200 cursor-pointer">
                <FilePenLine
                  className="text-green-600"
                  onClick={() =>
                    router.push(`/admin/questions/mcq/${question.id}`)
                  }
                />
              </div>

              {/* delete */}
              <div className="px-4 h-full flex items-center bg-red-50 overflow-hidden rounded-tr-lg rounded-br-lg cursor-pointer hover:bg-red-100">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </AlertDialogTrigger>
                  <AlertDialogContent aria-describedby="delete question">
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
        </div>
      </CardContent>
    </Card>
  );
};
export default QuestionCard;
