"use client";

import {
  useExamById,
  useStudentExam,
  useStudentExams,
} from "@/server/backend/queries/examQueries";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ExamQuestionCard from "../exams/ExamQuestionCard";
import { Student } from "@/server/db/schema/students";
import { useEffect, useState } from "react";
import { StudentResponse } from "@/lib/types";
import ExamTimer from "../exams/ExamTimer";
import { Button } from "../ui/button";
import AppDialog from "../AppDialog";
import { toast } from "sonner";
import { useRouter, useSearchParams } from "next/navigation";
import { format, addMinutes } from "date-fns";
import _ from "lodash";
import { useAnswerQuestion } from "@/server/backend/mutations/questionMutations";
import {
  useCancelStudentExam,
  useUpdateAnswerStudentExam,
} from "@/server/backend/mutations/examMutations";
import { useStudentAnswers } from "@/server/backend/queries/answerQueries";
import { useQueryClient } from "@tanstack/react-query";
import { useStudentById } from "@/server/backend/queries/studentQueries";
import { Separator } from "../ui/separator";

interface Props {
  examId: string;
  completed?: boolean;
}

const StudentExam = ({ examId, completed = false }: Props) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const startTime = new Date();

  const [studentResponse, setStudentResponse] = useState<StudentResponse[]>([]);

  //from search params
  const studentId = searchParams.get("studentId") ?? "";
  const studentName = searchParams.get("studentName") ?? "";
  const role = searchParams.get("role") ?? "student";

  const { mutate: answerQuestion } = useAnswerQuestion();
  const { mutate: cancelStudentExam } = useCancelStudentExam();
  const { mutate: updateAnswerStudentExam } = useUpdateAnswerStudentExam();
  const { data: exam, isFetching: isFetchingExam } = useExamById(examId);
  const { data: studentExam, isFetching: studentExamFetching } = useStudentExam(
    { examId, studentId }
  );
  const { data: studentAnswers } = useStudentAnswers({
    examId,
    studentId: studentId,
  });

  // console.log("exam", exam);
  const typeIds = exam?.examQuestions.map((item) => {
    return {
      questionId: item.questions.id,
      typeId: item.questions.typeId,
    };
  });

  console.log("typeIds", typeIds);

  const completeExam = () => {
    queryClient.invalidateQueries({ queryKey: ["student-answers"] });
    const endTime = new Date();
    const durationSec = (endTime.getTime() - startTime.getTime()) / 1000;
    const durationMin = durationSec / 60;

    const correctAnswers =
      studentResponse?.reduce((acc, answer) => {
        if (answer.questionAnswer === answer.studentAnswer) return acc + 1;
        return acc;
      }, 0) ?? 0;
    const marks =
      correctAnswers && exam && exam.examQuestions
        ? (correctAnswers / exam.examQuestions.length) * 100
        : 0;

    updateAnswerStudentExam({
      examId,
      studentId: studentId,
      marks,
      duration: Math.round(durationMin),
      completedAt: endTime.toISOString(),
    });
    router.push(
      `/student/completed-exam/${examId}?studentId=${studentId}&studentName=${studentName}&role=${role}`
    );
  };

  const answerExamQuestion = ({
    questionId,
    studentAnswer,
    questionAnswer,
  }: StudentResponse) => {
    setStudentResponse([
      ...studentResponse,
      {
        questionId,
        studentAnswer,
        questionAnswer,
      },
    ]);

    answerQuestion({
      examId,
      studentId: studentId,
      questionId,
      studentAnswer,
      questionAnswer,
    });
  };

  const cancelExam = () => {
    cancelStudentExam({
      examId,
      studentId: studentId,
    });
    router.back();
  };

  if (isFetchingExam) {
    return (
      <div className="flex w-full mt-10 justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="relative">
      {exam ? (
        <Card className="flex flex-col justify-start dark:border-primary/40 bg-transparent">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between items-center relative">
                <div className="text-2xl font-bold flex gap-2">
                  <span className="uppercase">{exam.name} Exam,</span>
                  <span>{role === "admin" && studentName}</span>
                  <span>{completed && "Answer Sheet"}</span>
                </div>
                {!completed && <ExamTimer examDuration={exam.duration ?? 60} />}
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-4 flex flex-col h-full">
            {exam && exam.examQuestions.length ? (
              exam.examQuestions.map((item, index) => {
                const studentAnswer = studentAnswers?.find(
                  (answer) => answer.questionId === item.questionId
                );
                return (
                  <ExamQuestionCard
                    key={index}
                    question={item.questions}
                    questionNumber={index + 1}
                    examId={examId}
                    role={role}
                    answer={studentAnswer}
                    answerExamQuestion={answerExamQuestion}
                    completed={completed}
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

            <div className="mt-8 flex gap-4 self-end">
              {/* cancel exam */}
              {!completed && (
                <AppDialog
                  trigger={<Button variant="outline">Cancel</Button>}
                  body={
                    <p className="font-semibold text-lg">
                      Are you sure you want to{" "}
                      <span className="font-bold text-red-500">Cancel</span>{" "}
                      this Exam
                    </p>
                  }
                  title="Cancel Exam"
                  okDialog={cancelExam}
                />
              )}

              {/* finish exam */}
              {!completed && (
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
              )}

              {completed && (
                <Button onClick={() => router.push("/")}>Back</Button>
              )}
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

      {/* result */}
      {completed && studentExamFetching ? (
        <Loader2 className="w-6 h-6 animate-spin top-8 right-8 absolute" />
      ) : (
        <div className="flex flex-col top-8 right-8 absolute z-10 text-red-600 -rotate-[25deg]">
          <p className="font-bold text-7xl font-marks">{studentExam?.marks}</p>
          <Separator className="font-marks h-2 bg-red-600" />
          <p className="font-bold text-7xl font-marks">100</p>
        </div>
      )}
    </div>
  );
};
export default StudentExam;
