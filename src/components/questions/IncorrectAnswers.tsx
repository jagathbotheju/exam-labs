"use client";

import { useState } from "react";
import SubjectSelector from "../subjects/SubjectSelector";
import { UserExt } from "@/server/db/schema/users";
import StudentSelector from "../student/StudentSelector";

const IncorrectAnswers = () => {
  const [subjectId, setSubjectId] = useState("");
  const [selectedStudent, setSelectedStudent] = useState<UserExt | null>(null);

  console.log("selectedStudent", selectedStudent);

  return (
    <div className="flex flex-col w-full">
      <div className="flex justify-between">
        <h1 className="text-3xl font-semibold">Incorrect Questions</h1>

        <div className="flex gap-4 items-center">
          <SubjectSelector setSubject={setSubjectId} subjectId={subjectId} />
          <StudentSelector setSelectedStudent={setSelectedStudent} />
        </div>
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
export default IncorrectAnswers;
