"use client";
import { useExamById } from "@/server/backend/queries/examQueries";
import { Loader2 } from "lucide-react";
import _ from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import QuestionCard from "../questions/QuestionCard";
import { Question } from "@/server/db/schema/questions";
import { ExamQuestion } from "@/server/db/schema/examQuestions";
import ExamQuestionCard from "./ExamQuestionCard";

interface Props {
  examId: string;
}

const ExamDetails = ({ examId }: Props) => {
  const { data: exam, isLoading } = useExamById(examId);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (_.isEmpty(exam) || !exam) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-bold text-muted-foreground">
          No Exams Found!, Please add one
        </h1>
      </div>
    );
  }

  // const questions = exam.examQuestions as ExamQuestion[];
  // console.log("exam questions", questions[0].questions);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">
          <span className="uppercase">{exam.name}</span>, Exam Details
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col">
        {exam.examQuestions.map((item, index) => {
          return (
            <ExamQuestionCard
              key={index}
              index={index + 1}
              question={item.questions}
              examId={examId}
            />
          );
        })}
      </CardContent>
    </Card>
  );
};
export default ExamDetails;
