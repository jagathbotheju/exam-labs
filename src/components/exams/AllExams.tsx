"use client";
import { useExams } from "@/server/backend/queries/examQueries";
import { Loader2, Trash2 } from "lucide-react";
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

const AllExams = () => {
  const { data: exams, isFetching } = useExams();

  if (isFetching) {
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
            <TableCell className="font-medium whitespace-nowrap">
              {exam.id}
            </TableCell>
            <TableCell className="uppercase">{exam.name}</TableCell>
            <TableCell className="uppercase">{exam.subjects.title}</TableCell>
            <TableCell className="text-center">
              {exam.examQuestions.length}
            </TableCell>
            <TableCell className="text-left text-slate-200">
              <DeleteExamDialog
                examTitle={exam.name}
                examId={exam.id}
                trigger={<Trash2 className="w-4 cursor-pointer text-red-500" />}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default AllExams;
