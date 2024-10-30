"use client";
import { Student } from "@/server/db/schema/students";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useStudentExams } from "@/server/backend/queries/examQueries";
import { Loader2 } from "lucide-react";

interface Props {
  student: Student;
}

const MyExams = ({ student }: Props) => {
  const { data: studentExams, isPending } = useStudentExams(student.id);

  if (isPending) {
    return (
      <div className="fle xw-full mt-10">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  // console.log("studentExams", studentExams);

  return (
    <div className="flex flex-col w-full">
      <Card>
        <CardHeader>
          <CardTitle>
            <h1 className="text-2xl font-bold">My Exams</h1>
          </CardTitle>
        </CardHeader>
        <CardContent></CardContent>
      </Card>
    </div>
  );
};
export default MyExams;
