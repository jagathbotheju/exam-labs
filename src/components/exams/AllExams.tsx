"use client";
import {
  useExams,
  useExamsBySubject,
} from "@/server/backend/queries/examQueries";
import { Eye, Loader2, Trash2, UserRoundPlus } from "lucide-react";
import _ from "lodash";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import DeleteExamDialog from "./DeleteExamDialog";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import SubjectSelector from "../subjects/SubjectSelector";
import { useState } from "react";

const AllExams = () => {
  const router = useRouter();
  const [subjectId, setSubject] = useState("");
  // const { data: exams, isPending } = useExams();
  const { data: exams, isPending } = useExamsBySubject(subjectId);

  return (
    <Card className="bg-transparent dark:border-primary/40">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <p className="text-2xl font-bold">All Exams</p>
          <SubjectSelector setSubject={setSubject} subjectId={subjectId} />
        </CardTitle>
      </CardHeader>
      <CardContent>
        {!subjectId ? (
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-muted-foreground">
              Please select subject
            </h1>
          </div>
        ) : isPending ? (
          <div className="flex items-center justify-center">
            <Loader2 className="w-10 h-10 animate-spin" />
          </div>
        ) : _.isEmpty(exams) || !exams ? (
          <div className="flex items-center justify-center">
            <h1 className="text-xl font-bold text-muted-foreground">
              No Exams Found!, Please add one
            </h1>
          </div>
        ) : (
          <Table className="w-full md:max-w-xl">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Questions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam) => (
                <TableRow key={exam.id}>
                  <TableCell
                    onClick={() => router.push(`/admin/exams/${exam.id}`)}
                    className="font-medium whitespace-nowrap cursor-pointer"
                  >
                    {exam.id}
                  </TableCell>
                  <TableCell className="uppercase whitespace-nowrap">
                    {exam.name}
                  </TableCell>
                  <TableCell className="uppercase">
                    {exam.subjects.title}
                  </TableCell>
                  <TableCell className="text-center">
                    {exam.examQuestions.length}
                  </TableCell>

                  {/* exam details */}
                  <TableCell className="text-left">
                    <Eye
                      onClick={() => router.push(`/admin/exams/${exam.id}`)}
                      className="w-5 h-5 cursor-pointer"
                    />
                  </TableCell>

                  {/* delete exam */}
                  <TableCell className="text-left">
                    <DeleteExamDialog
                      examTitle={exam.name}
                      examId={exam.id}
                      trigger={
                        <Trash2 className="w-5 h-5 cursor-pointer text-red-500" />
                      }
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
export default AllExams;
