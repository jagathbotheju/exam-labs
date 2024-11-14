"use client";
import { useExams } from "@/server/backend/queries/examQueries";
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

const AllExams = () => {
  const router = useRouter();
  const { data: exams, isPending } = useExams();

  if (isPending) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (_.isEmpty(exams) || !exams) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-bold text-muted-foreground">
          No Exams Found!, Please add one
        </h1>
      </div>
    );
  }

  return (
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
            <TableCell className="uppercase">{exam.subjects.title}</TableCell>
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
  );
};
export default AllExams;
