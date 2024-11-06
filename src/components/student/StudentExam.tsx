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
import {
  useCancelStudentExam,
  useUpdateAnswerStudentExam,
} from "@/server/backend/mutations/examMutations";
import { useStudentAnswers } from "@/server/backend/queries/answerQueries";
import { useQueryClient } from "@tanstack/react-query";

interface Props {
  examId: string;
  student: Student;
  completed?: boolean;
}

const StudentExam = ({ examId, student, completed = false }: Props) => {
  const queryClient = useQueryClient();
  const startTime = new Date();
  const router = useRouter();
  // const [answers, setAnswers] = useState<StudentResponse[]>([]);

  const { data: exam, isLoading } = useExamById(examId);
  const { mutate: answerQuestion } = useAnswerQuestion();
  const { mutate: cancelStudentExam } = useCancelStudentExam();
  const { mutate: updateAnswerStudentExam } = useUpdateAnswerStudentExam();
  const { data: studentAnswers } = useStudentAnswers({
    examId,
    studentId: student.id,
  });

  // console.log("exam", exam);

  if (isLoading) {
    return (
      <div className="flex w-full mt-10 justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  const completeExam = () => {
    queryClient.invalidateQueries({ queryKey: ["student-answers"] });
    const endTime = new Date();
    const marks = studentAnswers
      ? studentAnswers.reduce((acc, answer) => {
          if (answer.questionAnswer === answer.studentAnswer) return acc + 2.5;
          return acc;
        }, 0)
      : 0;
    const durationSec = (endTime.getTime() - startTime.getTime()) / 1000;
    const durationMin = durationSec / 60;

    updateAnswerStudentExam({
      examId,
      studentId: student.id,
      marks,
      duration: Math.round(durationMin),
      completedAt: endTime.toISOString(),
    });
    router.push("/");
  };

  const answerExamQuestion = ({
    questionId,
    studentAnswer,
    questionAnswer,
  }: StudentResponse) => {
    answerQuestion({
      examId,
      studentId: student.id,
      questionId,
      studentAnswer,
      questionAnswer,
    });
  };

  const cancelExam = () => {
    // setAnswers([]);
    cancelStudentExam({
      examId,
      studentId: student.id,
    });
    router.back();
  };

  return (
    <div>
      {exam ? (
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle>
              <div className="flex justify-between items-center">
                <p className="uppercase text-2xl font-bold">
                  {exam.name} {completed && ",Answer Sheet"}
                </p>
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
                    questionNumber={item.questionNumber}
                    examId={examId}
                    student={student}
                    answer={studentAnswer}
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

              {completed && <Button onClick={() => router.back()}>Back</Button>}
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
