"use client";

import { useEffect, useState } from "react";
import SubjectSelector from "../subjects/SubjectSelector";
import { UserExt } from "@/server/db/schema/users";
import StudentSelector from "../student/StudentSelector";
import ResultSummary from "../student/ResultSummary";
import { Loader2 } from "lucide-react";
import { useSubjects } from "@/server/backend/queries/subjectQueries";
import QuestionsTypePicker from "./QuestionsTypePicker";
import { QuestionType } from "@/server/db/schema/questionTypes";
import {
  useIncorrectQuestions,
  useQuestionsBySubjectPagination,
} from "@/server/backend/queries/questionQueries";
import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import QuestionCard from "./QuestionCard";

const IncorrectQuestions = () => {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [subjectId, setSubjectId] = useState<string | undefined>();
  const [selectedStudent, setSelectedStudent] = useState<UserExt | null>(null);
  const [questionType, setQuestionType] = useState<QuestionType>();

  const { data: subjects } = useSubjects();
  const subject = subjects?.find((subject) => subject.id === subjectId);
  const { data: incorrectQuestions, isPending } = useIncorrectQuestions({
    studentId: selectedStudent?.id,
    subjectId,
  });

  useEffect(() => {
    if (subjectId && page && selectedStudent) {
      queryClient.invalidateQueries({
        queryKey: ["questions-by-subject-pagination"],
      });
      queryClient.invalidateQueries({
        queryKey: ["questions-count"],
      });
      queryClient.invalidateQueries({
        queryKey: ["incorrect-questions"],
      });
    }
  }, [selectedStudent, subjectId, questionType, queryClient, page]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex flex-col">
        <div className="flex justify-between">
          <h1 className="text-3xl font-semibold">Incorrect Questions</h1>

          <div className="flex gap-4 items-center">
            {subject?.title === "sinhala" && (
              <QuestionsTypePicker
                questionType={questionType}
                setQuestionType={setQuestionType}
              />
            )}
            <SubjectSelector setSubject={setSubjectId} subjectId={subjectId} />
            <StudentSelector setSelectedStudent={setSelectedStudent} />
          </div>
        </div>

        {/* incorrect questions */}
        {isPending ? (
          <div className="flex justify-center items-center w-full mt-10">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ) : (
          <div className="flex flex-col w-full gap-4 mt-10">
            {incorrectQuestions &&
              !_.isEmpty(subject) &&
              !_.isEmpty(incorrectQuestions) &&
              incorrectQuestions.map((question, index) => {
                return (
                  <QuestionCard
                    key={question.id}
                    question={question}
                    index={page + index}
                    subjectId={subject.id}
                    studentId={selectedStudent?.id}
                  />
                );
              })}
          </div>
        )}
      </div>

      {!subjectId && (
        <div className="flex w-full mt-20">
          <div className="w-full rounded-md p-10">
            <h1 className="text-3xl font-semibold text-center text-muted-foreground">
              Please select Subject
            </h1>
          </div>
        </div>
      )}

      {!selectedStudent && subjectId && (
        <div className="flex w-full mt-20">
          <div className="w-full rounded-md p-10">
            <h1 className="text-3xl font-semibold text-center text-muted-foreground">
              Please select Student
            </h1>
          </div>
        </div>
      )}
    </div>
  );
};
export default IncorrectQuestions;
