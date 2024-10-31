"use client";

import {
  useExamById,
  useStudentExams,
} from "@/server/backend/queries/examQueries";
import { Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import ExamQuestionCard from "../exams/ExamQuestionCard";
import { Student } from "@/server/db/schema/students";

interface Props {
  examId: string;
  student: Student;
}

const StudentExam = ({ examId, student }: Props) => {
  const { data: exam, isLoading } = useExamById(examId);

  console.log("studentExam", examId);

  if (isLoading) {
    return (
      <div className="fle w-full mt-10 justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div>
      {exam ? (
        <Card className="flex flex-col">
          <CardHeader>
            <CardTitle className="uppercase text-2xl font-bold">
              {exam.name}
            </CardTitle>
          </CardHeader>
          <CardContent className="gap-4 flex flex-col h-full">
            {exam && exam.examQuestions.length ? (
              exam.examQuestions.map((item, index) => {
                return (
                  <ExamQuestionCard
                    key={index}
                    index={index + 1}
                    question={item.questions}
                    examId={examId}
                    student={student}
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
