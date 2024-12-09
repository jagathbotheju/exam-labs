"use client";

import {
  useExamById,
  useStudentExam,
  useStudentExams,
} from "@/server/backend/queries/examQueries";
import { Loader2, Printer } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ExamQuestionCard from "../exams/ExamQuestionCard";
import { useMemo, useRef, useState } from "react";
import { StudentResponse } from "@/lib/types";
import ExamTimer from "../exams/ExamTimer";
import { Button } from "../ui/button";
import AppDialog from "../AppDialog";
import { useRouter, useSearchParams } from "next/navigation";
import _ from "lodash";
import { useAnswerQuestion } from "@/server/backend/mutations/questionMutations";
import {
  useCancelStudentExam,
  useCompleteExam,
} from "@/server/backend/mutations/examMutations";
import { useStudentAnswers } from "@/server/backend/queries/answerQueries";
import { useQueryClient } from "@tanstack/react-query";
import { Separator } from "../ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { cn } from "@/lib/utils";
import { differenceInMinutes, format } from "date-fns";
import Countdown, { zeroPad } from "react-countdown";
// import { useReactToPrint } from "react-to-print";

type QType = {
  score: number;
  questionTypeId: string;
  questionType: string;
  correctTypeLength: number;
};

interface Props {
  examId: string;
  completed?: boolean;
}

const StudentExam = ({ examId, completed = false }: Props) => {
  const contentRef = useRef<HTMLDivElement>(null);
  // const reactToPrintFn = useReactToPrint({
  //   contentRef,
  //   fonts: [
  //     {
  //       family: "Noto_Sans_Sinhala",
  //       source: "/fonts/NotoSansSinhala.ttf",
  //     },
  //   ],
  // });

  const router = useRouter();
  const searchParams = useSearchParams();
  const queryClient = useQueryClient();
  const startTime = useMemo(() => new Date(), []);

  const [studentResponse, setStudentResponse] = useState<StudentResponse[]>([]);

  //from search params
  const studentId = searchParams.get("studentId") ?? "";
  const studentName = searchParams.get("studentName") ?? "";
  const role = searchParams.get("role") ?? "student";

  const { mutate: answerQuestion } = useAnswerQuestion();
  const { mutate: cancelStudentExam } = useCancelStudentExam();
  const {
    mutate: completeExamMut,
    isSuccess: completeExamSuccess,
    isPending: completeExamPending,
  } = useCompleteExam();
  const { data: exam, isPending: isPendingExam } = useExamById(examId);
  const {
    data: studentExam,
    isPending: studentExamPending,
    isFetching: studentExamFetching,
  } = useStudentExam({
    examId,
    studentId,
  });
  const { data: studentAnswers } = useStudentAnswers({
    examId,
    studentId: studentId,
  });

  const examDurationMin = exam && exam.duration ? exam.duration : 0;
  const examTimerMemo = useMemo(
    () => <ExamTimer examDurationMin={examDurationMin} />,
    [examDurationMin]
  );

  const correctAnswersTest =
    studentAnswers?.reduce((acc, answer) => {
      if (answer.questionAnswer === answer.studentAnswer) return acc + 1;
      return acc;
    }, 0) ?? 0;
  console.log("correctAnswers", correctAnswersTest);

  const completeExam = () => {
    queryClient.invalidateQueries({ queryKey: ["student-answers"] });
    const endTime = new Date();
    const durationMin = differenceInMinutes(endTime, startTime);

    const correctAnswers =
      studentAnswers?.reduce((acc, answer) => {
        if (answer.questionAnswer === answer.studentAnswer) return acc + 1;
        return acc;
      }, 0) ?? 0;
    const marks =
      correctAnswers && exam && exam.examQuestions
        ? (correctAnswers / exam.examQuestions.length) * 100
        : 0;

    completeExamMut({
      examId,
      subjectId: exam?.subjectId ?? "",
      studentId: studentId,
      marks,
      duration: durationMin,
      completedAt: endTime.toISOString(),
    });

    router.push(
      `/student/completed-exam/${examId}?studentId=${studentId}&studentName=${studentName}&role=${role}`
    );
  };

  const answerExamQuestion = ({
    questionId,
    questionTypeId,
    studentAnswer,
    questionAnswer,
  }: StudentResponse) => {
    //setting studentResponse to calculate number of correct answers
    //used in completeExam marks
    const exist = studentResponse.find(
      (item) => item.questionId === questionId
    );
    if (exist) {
      _.forEach(studentResponse, (item) => {
        if (item.questionId === exist.questionId) {
          item.studentAnswer = studentAnswer;
        }
      });
    } else {
      setStudentResponse([
        ...studentResponse,
        {
          questionId,
          questionTypeId,
          studentAnswer,
          questionAnswer,
        },
      ]);
    }

    answerQuestion({
      examId,
      studentId: studentId,
      questionId,
      questionTypeId,
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

  if (isPendingExam) {
    return (
      <div className="flex w-full mt-10 justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (_.isEmpty(exam)) {
    return (
      <div className="flex w-full mt-10 justify-center items-center">
        <h2 className="text-3xl text-muted-foreground font-semibold">
          No Exam Found
        </h2>
      </div>
    );
  }

  if (completeExamPending) {
    return (
      <div className="flex w-full mt-10 justify-center items-center gap-2">
        <Loader2 className="w-8 h-8 animate-spin" />
        <h2 className="text-3xl text-muted-foreground font-semibold">
          Please wait, Checking Answers.....!
        </h2>
      </div>
    );
  }

  const questionTypes = [] as QType[];
  studentAnswers?.forEach((answer) => {
    if (answer.questionAnswer === answer.studentAnswer) {
      const exist = questionTypes.find(
        (item) => item.questionTypeId === answer.questionTypeId
      );
      if (exist) {
        _.forEach(questionTypes, (type) => {
          if (type.questionTypeId === answer.questionTypeId) {
            type.score += 1;
            type.correctTypeLength += 1;
          }
        });
      } else {
        questionTypes.push({
          score: 1,
          correctTypeLength: 1,
          questionType: answer.questionTypes.type,
          questionTypeId: answer.questionTypeId ?? "",
        });
      }
    }

    if (answer.questionAnswer !== answer.studentAnswer) {
      const exist = questionTypes.find(
        (item) => item.questionTypeId === answer.questionTypeId
      );
      if (exist) {
        _.forEach(questionTypes, (type) => {
          if (type.questionTypeId === answer.questionTypeId) {
            // type.score += 1;
            type.correctTypeLength += 1;
          }
        });
      } else {
        questionTypes.push({
          score: 0,
          correctTypeLength: 1,
          questionType: answer.questionTypes.type,
          questionTypeId: answer.questionTypeId ?? "",
        });
      }
    }
  });

  return (
    <div className="flex flex-col gap-8 relative">
      {!completed && examTimerMemo}

      <div ref={contentRef} className="flex flex-col gap-4">
        {/* knowledge area */}
        {completed && (
          <Card className="dark:bg-transparent dark:border-primary/40">
            <CardHeader>
              <div className="flex justify-between">
                <CardTitle className="text-2xl font-bold">
                  Result Summary {`,${studentName}`}
                </CardTitle>

                {/* print */}
                {/* <Printer
                  className="cursor-pointer"
                  onClick={() => reactToPrintFn()}
                /> */}
              </div>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-semibold text-xl">
                      Knowledge Area
                    </TableHead>
                    <TableHead className="font-semibold text-xl">
                      Score
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {questionTypes &&
                    studentAnswers &&
                    questionTypes.map((item, index) => {
                      const score = (
                        (item.score / item.correctTypeLength) *
                        100
                      ).toFixed();
                      return (
                        <TableRow key={item.questionTypeId + index}>
                          <TableCell className="font-sinhala text-xl">
                            {item.questionType}
                          </TableCell>
                          <TableCell
                            className={cn("text-xl font-semibold", {
                              "text-green-700": +score > 70,
                              "text-yellow-500": +score < 70,
                              "text-red-700": +score < 40,
                            })}
                          >
                            {(
                              (item.score / item.correctTypeLength) *
                              100
                            ).toFixed()}
                            %
                          </TableCell>
                        </TableRow>
                      );
                    })}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

        <Card className="flex flex-col justify-start dark:border-primary/40 dark:bg-transparent">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between items-center relative">
                <div className="text-2xl font-bold flex gap-2">
                  <span className="uppercase">{exam?.name} Exam,</span>
                  <span>{role === "admin" && studentName}</span>
                  <span>{completed && "Answer Sheet"}</span>
                </div>
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

            <div className="mt-8 flex gap-4 self-end print:hidden">
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

        {/* result */}
        {studentExamFetching ? (
          <Loader2 className="w-6 h-6 animate-spin" />
        ) : (
          <div className="top-8 right-8 absolute">
            {/* {studentExamPending && <Loader2 className="w-6 h-6 animate-spin" />} */}
            {completed && !_.isEmpty(exam.examQuestions) && (
              <div className="flex flex-col top-8 right-8 absolute z-10 text-red-600 -rotate-[25deg]">
                <p className="font-bold text-7xl font-marks">
                  {studentExam?.marks}
                </p>
                <Separator className="font-marks h-2 bg-red-600" />
                <p className="font-bold text-7xl font-marks">100</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
export default StudentExam;
