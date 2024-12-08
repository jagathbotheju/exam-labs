"use client";
import { useEffect, useState } from "react";
import SubjectSelector from "../subjects/SubjectSelector";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import AddQuestionTypeForm from "./AddQuestionTypeForm";
import AllQuestionTypes from "./AllQuestionTypes";
import { useQueryClient } from "@tanstack/react-query";

const QuestionTypes = () => {
  const queryClient = useQueryClient();
  const [subjectId, setSubject] = useState("");

  useEffect(() => {
    if (subjectId) {
      queryClient.invalidateQueries({
        queryKey: ["question-type-subject-id"],
      });
    }
  }, [subjectId, queryClient]);

  return (
    <>
      <Card className="flex flex-col w-full h-fit dark:bg-transparent dark:border-primary/40">
        <CardHeader>
          <CardTitle className="flex justify-between">
            <p className="text-2xl font-bold">Add New Question Type</p>
            <SubjectSelector subjectId={subjectId} setSubject={setSubject} />
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddQuestionTypeForm subjectId={subjectId} />
        </CardContent>
      </Card>

      <Card className="dark:bg-transparent dark:border-primary/40">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            All Question Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AllQuestionTypes subjectId={subjectId} />
        </CardContent>
      </Card>
    </>
  );
};
export default QuestionTypes;
