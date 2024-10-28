"use client";

import { useEffect, useState } from "react";
import SubjectSelector from "../subjects/SubjectSelector";
import { useQuestionsBySubject } from "@/server/backend/queries/questionQueries";
import { Loader2 } from "lucide-react";
import QuestionCard from "./QuestionCard";
import { useQueryClient } from "@tanstack/react-query";

const AllQuestions = () => {
  const queryClient = useQueryClient();
  const [subject, setSubject] = useState("");
  const {
    data: questions,
    isFetching,
    isPending,
  } = useQuestionsBySubject(subject);

  useEffect(() => {
    if (subject) {
      queryClient.invalidateQueries({ queryKey: ["questions-by-subject"] });
    }
  }, [subject, queryClient]);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Questions</h1>

        <SubjectSelector setSubject={setSubject} />
      </div>

      {isFetching ||
        (isPending && (
          <div className="flex justify-center items-center w-full mt-10">
            <Loader2 className="w-8 h-8 animate-spin" />
          </div>
        ))}

      {!subject && (
        <div className="flex w-full mt-20">
          <div className="w-full rounded-md p-10">
            <h1 className="text-3xl font-semibold text-center text-muted-foreground">
              Please select Subject
            </h1>
          </div>
        </div>
      )}

      {/* questions */}
      <div className="flex flex-col w-full gap-4 mt-10">
        {questions &&
          questions.map((question, index) => (
            <QuestionCard
              key={question.id}
              question={question}
              index={index + 1}
            />
          ))}
      </div>
    </div>
  );
};
export default AllQuestions;
