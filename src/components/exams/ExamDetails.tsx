"use client";
import { useExamById } from "@/server/backend/queries/examQueries";
import { Loader2 } from "lucide-react";
import _ from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import QuestionCard from "../questions/QuestionCard";
import { Question } from "@/server/db/schema/questions";
import { ExamQuestion } from "@/server/db/schema/examQuestions";
import ExamQuestionCard from "./ExamQuestionCard";
import StudentSelector from "../student/StudentSelector";
import { useState } from "react";
import { Button } from "../ui/button";

interface Props {
  examId: string;
}

const ExamDetails = ({ examId }: Props) => {
  const { data: exam, isLoading } = useExamById(examId);
  const [selectedStudent, setSelectedStudent] = useState<null | string>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  // if (_.isEmpty(exam?.examQuestions) || !exam) {
  //   return (
  //     <div className="flex items-center justify-center mt-10">
  //       <h1 className="text-xl font-bold text-muted-foreground">
  //         No Exams Found!, Please add one
  //       </h1>
  //     </div>
  //   );
  // }

  console.log("exam", exam);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="uppercase text-2xl font-bold">
            <span>{exam?.name}</span>, Exam Details
          </div>
          {exam && exam.examQuestions && (
            <div className="flex items-center gap-2">
              <p>Assign Exam to Student</p>
              <StudentSelector setSelectedStudent={setSelectedStudent} />
              <Button>Assign</Button>
            </div>
          )}
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
  );
};
export default ExamDetails;
