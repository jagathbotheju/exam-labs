"use client";

import { useEffect, useState } from "react";
import SubjectSelector from "../subjects/SubjectSelector";
import { useQuestionsBySubject } from "@/server/backend/queries/questionQueries";
import { Loader2 } from "lucide-react";
import QuestionCard from "./QuestionCard";
import { useQueryClient } from "@tanstack/react-query";
import _ from "lodash";
import { useSearchParams } from "next/navigation";

const AllQuestions = () => {
  const queryClient = useQueryClient();
  const searchParams = useSearchParams();
  const [subjectId, setSubjectId] = useState<string>(
    searchParams.get("subjectId") ?? ""
  );

  const { data: questions, isFetching } = useQuestionsBySubject(subjectId);

  useEffect(() => {
    if (subjectId) {
      queryClient.invalidateQueries({ queryKey: ["questions-by-subject"] });
    }
  }, [subjectId, queryClient]);

  // console.log("questions", questions);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Questions</h1>

        <SubjectSelector setSubject={setSubjectId} subjectId={subjectId} />
      </div>

      {/* questions */}
      {isFetching ? (
        <div className="flex justify-center items-center w-full mt-10">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col w-full gap-4 mt-10">
          {questions &&
            !_.isEmpty(questions) &&
            questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index + 1}
                subjectId={subjectId}
              />
            ))}
        </div>
      )}

      {!subjectId && !isFetching && (
        <div className="flex w-full mt-20">
          <div className="w-full rounded-md p-10">
            <h1 className="text-3xl font-semibold text-center text-muted-foreground">
              Please select Subject
            </h1>
          </div>
        </div>
      )}

      {_.isEmpty(questions) && !isFetching && subjectId.length > 0 && (
        <div className="mt-10 flex w-full">
          <h2 className="text-3xl font-semibold text-muted-foreground mx-auto">
            {`No questions found`}
          </h2>
        </div>
      )}
    </div>
  );
};
export default AllQuestions;
