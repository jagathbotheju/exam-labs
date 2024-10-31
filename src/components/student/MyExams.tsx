"use client";
import { Student } from "@/server/db/schema/students";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useStudentExams } from "@/server/backend/queries/examQueries";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";

interface Props {
  studentId: string;
}

const MyExams = ({ studentId }: Props) => {
  const { data: studentExams, isPending } = useStudentExams(studentId);

  if (isPending) {
    return (
      <div className="fle w-full mt-10 justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  console.log("studentExams", studentExams);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">My Exams</CardTitle>
      </CardHeader>
      <CardContent>
        <Table className="w-full md:max-w-xl">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Questions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody></TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};
export default MyExams;
