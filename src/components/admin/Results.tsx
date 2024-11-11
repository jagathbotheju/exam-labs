"use client";
import MyExams from "../exams/MyExams";
import { Student, StudentExt } from "@/server/db/schema/students";
import StudentSelector from "../student/StudentSelector";
import { useEffect, useState } from "react";
import _ from "lodash";

interface Props {
  admin: Student;
}

const Results = ({ admin }: Props) => {
  const [selectedStudent, setSelectedStudent] = useState<StudentExt | null>(
    null
  );

  return (
    <div className="flex flex-col w-full">
      <div className="flex w-full items-center justify-between">
        <p className="text-2xl font-bold">Exam Results</p>
        <StudentSelector setSelectedStudent={setSelectedStudent} />
      </div>

      <div className="mt-8">
        {selectedStudent ? (
          <MyExams
            // studentId={selectedStudent.id}
            role={admin.role}
            student={selectedStudent}
          />
        ) : (
          <div className="flex justify-center mt-8">
            <h2 className="text-3xl font-bold text-muted-foreground">
              Please select a Student
            </h2>
          </div>
        )}
      </div>
    </div>
  );
};
export default Results;
