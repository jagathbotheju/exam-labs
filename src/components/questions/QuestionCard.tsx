"use client";
import { Question, QuestionExt } from "@/server/db/schema/questions";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import Link from "next/link";
import {
  CircleX,
  Edit2,
  FilePenLine,
  FilePlus,
  Router,
  Trash2,
} from "lucide-react";
import {
  useAddQuestionToExam,
  useDeleteQuestion,
  useRemoveQuestionFromExam,
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
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useExamById, useExams } from "@/server/backend/queries/examQueries";
import { Badge } from "../ui/badge";
import { ExamExt } from "@/server/db/schema/exams";
import { useQuestionTypes } from "@/server/backend/queries/questionTypeQueries";
import { useStudents } from "@/server/backend/queries/studentQueries";
import _ from "lodash";

interface Props {
  question: QuestionExt;
  index: number;
  subjectId: string;
  studentId?: string;
}

const QuestionCard = ({ question, index, subjectId, studentId }: Props) => {
  const router = useRouter();
  const [exam, setExam] = useState("");
  const [questionExams, setQuestionExams] = useState<ExamExt[] | undefined>();

  const { data: students } = useStudents();
  const student = students?.find((student) => student.id === studentId);
  const { mutate: deleteQuestion } = useDeleteQuestion();
  const { mutate: removeQuestionFromExam } = useRemoveQuestionFromExam();
  const { mutate: addQuestion } = useAddQuestionToExam();
  const { data: exams } = useExams();
  const { data: questionTypes } = useQuestionTypes();
  const questionType = questionTypes?.find(
    (type) => type.id === question.typeId
  )?.type;

  const addQuestionToExam = () => {
    if (exam && question.id) {
      addQuestion({
        questionId: question.id,
        examId: exam,
        questionNumber: index,
      });
    } else {
      return toast.error("Unable to Add, not enough data...");
    }
  };

  useEffect(() => {
    const examIds = question.examQuestions?.map((item) => item.examId);
    const questionExams = exams?.filter((item) =>
      examIds?.find((id) => id === item.id)
    );
    if (questionExams) setQuestionExams(questionExams);
  }, [exams, question.examQuestions]);

  return (
    <Card className="dark:bg-slate-900 bg-slate-50">
      <CardContent className="p-0">
        <div className="flex flex-col hover:drop-shadow-xl p-2">
          <div className="flex justify-between">
            {/* question type */}
            {questionType && (
              <Badge variant="secondary" className="w-fit font-sinhala">
                {questionType}
              </Badge>
            )}
            {/* if incorrect questions student name */}
            {!_.isEmpty(student) && (
              <Badge variant="outline" className="border border-primary">
                {student.name}
              </Badge>
            )}
          </div>

          <div className="flex justify-between h-full">
            <div className="flex gap-2 items-center h-full w-full">
              {/* <div className="dark:bg-slate-800 bg-slate-300 px-4 h-full font-bold rounded-tl-lg rounded-bl-lg flex items-center justify-center">
                {index}
              </div> */}
              <div className="flex flex-col gap-1 py-1">
                <div className="flex-1 h-full">
                  <div className="line-clamp-2 tracking-wide font-sinhala">
                    {parse(question.body)}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {questionExams &&
                    questionExams.length > 0 &&
                    questionExams.map((item, index) => (
                      <div className="relative" key={index}>
                        <Badge
                          variant="outline"
                          className="w-fit uppercase border-primary"
                        >
                          {item.name}
                        </Badge>
                        <CircleX
                          className="w-4 h-4 absolute -top-2 -right-2 text-white font-bold hover:bg-red-500 rounded-full cursor-pointer"
                          onClick={() =>
                            removeQuestionFromExam({
                              questionId: question.id,
                              examId: item.id,
                            })
                          }
                        />
                      </div>
                    ))}
                </div>
              </div>
            </div>

            {/* actions */}
            <div className="flex p-2 gap-2">
              {/* add to exam */}
              <div className="flex items-center hover:bg-opacity-70 cursor-pointer rounded-tr-lg">
                <AlertDialog>
                  <AlertDialogTrigger>
                    <FilePlus className="text-blue-600" />
                  </AlertDialogTrigger>
                  <AlertDialogContent aria-describedby="add question to exam">
                    <AlertDialogTitle className="flex justify-between">
                      Add Question to Exam
                      <ExamSelector setExam={setExam} subjectId={subjectId} />
                    </AlertDialogTitle>

                    <div className="py-1">
                      <p className="text-sm font-sinhala">
                        {parse(question.body)}
                      </p>
                      <p className="text-xs font-sinhala">{question.option1}</p>
                      <p className="text-xs font-sinhala">{question.option2}</p>
                      <p className="text-xs font-sinhala">{question.option3}</p>
                      <p className="text-xs font-sinhala">{question.option4}</p>
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
              <div className="flex items-center hover:bg-opacity-70 cursor-pointer">
                <FilePenLine
                  className="text-green-600"
                  onClick={() =>
                    router.push(`/admin/questions/mcq/${question.id}`)
                  }
                />
              </div>

              {/* delete */}
              <div className="flex items-center overflow-hidden rounded-br-lg cursor-pointer hover:bg-opacity-70">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </AlertDialogTrigger>
                  <AlertDialogContent aria-describedby="delete question">
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        Are you absolutely sure?
                      </AlertDialogTitle>
                      <AlertDialogDescription className="flex flex-col gap-1 font-semibold">
                        <span>This action cannot be undone.</span>
                        <span>This will permanently delete this Question.</span>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => deleteQuestion(question.id)}
                      >
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
