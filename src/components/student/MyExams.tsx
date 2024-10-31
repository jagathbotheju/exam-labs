"use client";
import { Student } from "@/server/db/schema/students";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useStudentExams } from "@/server/backend/queries/examQueries";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { format } from "date-fns";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "../ui/alert-dialog";
import { useRouter } from "next/navigation";

interface Props {
  studentId: string;
}

const MyExams = ({ studentId }: Props) => {
  const router = useRouter();
  const { data: studentExams, isPending } = useStudentExams(studentId);

  console.log("studentExams", studentExams);

  if (isPending) {
    return (
      <div className="fle w-full mt-10 justify-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-bold">My Exams</CardTitle>
      </CardHeader>
      <CardContent>
        {studentExams?.length ? (
          <Table className="w-full">
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead className="text-center">Questions</TableHead>
                <TableHead>Publish Date</TableHead>
                <TableHead>Completed Date</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Time</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {studentExams.map((item) => (
                <TableRow key={item.examId}>
                  {/* name */}
                  <TableCell className="uppercase whitespace-nowrap">
                    {item.exams.name}
                  </TableCell>

                  {/* subject */}
                  <TableCell className="uppercase">
                    {item.exams.subjects.title}
                  </TableCell>

                  {/* number of questions */}
                  <TableCell className="text-center">
                    {item.exams.examQuestions.length}
                  </TableCell>

                  {/* publish date */}
                  <TableCell className="text-start">
                    {format(item.exams.createdAt, "yyyy-MM-dd")}
                  </TableCell>

                  {/* completed date */}
                  <TableCell className="text-start whitespace-nowrap">
                    {item.completedAt ? (
                      format(item.completedAt, "yyyy-MM-dd")
                    ) : (
                      <Badge variant="destructive">pending</Badge>
                    )}
                  </TableCell>

                  {/* marks */}
                  <TableCell className="text-start whitespace-nowrap">
                    {item.completedAt ? (
                      item.marks
                    ) : (
                      <Badge variant="destructive">pending</Badge>
                    )}
                  </TableCell>

                  {/* time */}
                  <TableCell className="text-start whitespace-nowrap">
                    {item.completedAt ? (
                      item.duration
                    ) : (
                      <Badge variant="destructive">pending</Badge>
                    )}
                  </TableCell>

                  {/* start exam */}
                  {!item.completedAt && (
                    <TableCell className="text-start">
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button size="sm">Start Exam</Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>
                              Are you sure, start this Exam?
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                              <div className="flex flex-col gap-1">
                                <p>You are about to start this Exam.</p>
                                <p>
                                  You have 40 MCQ questions and 1 Hour to
                                  complete.
                                </p>
                                <p>Clock is only for reference.</p>
                                <p>
                                  You can continue doing Exam even after clock
                                  times up.
                                </p>
                              </div>
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() =>
                                router.push(`/student/exam/${item.examId}`)
                              }
                            >
                              Start
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="w-full flex justify-center items-center">
            <h2 className="font-semibold text-2xl text-muted-foreground">
              Student do not have any Exams!
            </h2>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
export default MyExams;
