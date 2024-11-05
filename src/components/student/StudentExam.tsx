"use client";

import {
  useExamById,
  useStudentExams,
} from "@/server/backend/queries/examQueries";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ExamQuestionCard from "../exams/ExamQuestionCard";
import { Student } from "@/server/db/schema/students";
import { useState } from "react";
import { StudentResponse } from "@/lib/types";
import ExamTimer from "../exams/ExamTimer";
import { Button } from "../ui/button";
import AppDialog from "../AppDialog";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format, addMinutes } from "date-fns";
import _ from "lodash";
import { useAnswerQuestion } from "@/server/backend/mutations/questionMutations";

interface Props {
  examId: string;
  student: Student;
}

const StudentExam = ({ examId, student }: Props) => {
  const startTime = new Date();
  const router = useRouter();
  const [answers, setAnswers] = useState<StudentResponse[]>([]);

  const { data: exam, isLoading } = useExamById(examId);
  const { mutate: answerQuestion } = useAnswerQuestion();

  if (isLoading) {
    return (
      <div className="flex w-full mt-10 justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  // console.log("exam", exam);

  const completeExam = () => {
    const endTime = new Date();
    const durationMinutes =
      Math.abs((endTime.getTime() - startTime.getTime()) / 1000) / 60;
    // const hrsMin = (duration / 60).toFixed(2).toString().split(".");
    // console.log("exam end", `hrs : ${hrsMin[0]}, min : ${hrsMin[1]}`);
    const diff = _.differenceBy(exam?.examQuestions, answers, "questionId");
    if (diff.length) {
      return toast.error(
        `Please answer Question number : ${diff[0]?.questionNumber}`
      );
    }

    console.log("answers", answers);

    setAnswers([]);
    router.push("/");
  };

  const answerExamQuestion = ({
    questionId,
    studentAnswer,
    questionAnswer,
  }: StudentResponse) => {
    console.log("StudentExam****", studentAnswer);
    answerQuestion({
      examId,
      studentId: student.id,
      questionId,
      studentAnswer,
      questionAnswer,
    });
  };

  const cancelExam = () => {
    setAnswers([]);
    toast.success("Exam Cancelled");
    router.back();
  };

  return (
    <div>
      {exam ? (
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between items-center">
                <p className="uppercase text-2xl font-bold">{exam.name}</p>
                <ExamTimer examDuration={exam.duration ?? 60} />
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-4 flex flex-col h-full">
            {exam && exam.examQuestions.length ? (
              exam.examQuestions.map((item, index) => {
                return (
                  <ExamQuestionCard
                    key={index}
                    question={item.questions}
                    questionNumber={item.questionNumber}
                    examId={examId}
                    student={student}
                    // setAnswers={setAnswers}
                    // answers={answers}
                    answerExamQuestion={answerExamQuestion}
                  />
                );
              })
            ) : (
              <div className="flex items-center justify-center mt-10">
                <h1 className="text-xl font-bold text-muted-foreground">
                  No Questions Found!
                </h1>
              </div>
            )}

            {/* cancel exam */}
            <div className="mt-8 flex gap-4 self-end">
              <AppDialog
                trigger={<Button variant="outline">Cancel</Button>}
                body={
                  <p className="font-semibold text-lg">
                    Are you sure you want to{" "}
                    <span className="font-bold text-red-500">Cancel</span> this
                    Exam
                  </p>
                }
                title="Cancel Exam"
                okDialog={cancelExam}
              />

              {/* finish exam */}
              <AppDialog
                trigger={<Button>Complete Exam</Button>}
                body={
                  <p className="font-semibold text-lg">
                    Are you sure you want to Finish this Exam
                  </p>
                }
                title="Complete Exam"
                okDialog={completeExam}
              />
            </div>
          </CardContent>
        </Card>
      ) : (
        <div>
          <div className="fle w-full mt-10 justify-center">
            <h2 className="font-semibold text-2xl">Exam Not Found!</h2>
          </div>
        </div>
      )}
    </div>
  );
};
export default StudentExam;
