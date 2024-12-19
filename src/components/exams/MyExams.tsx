"use client";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import {
  useStudentExams,
  useStudentExamsCount,
  useStudentExamsPagination,
} from "@/server/backend/queries/examQueries";
import { Eye, Loader2, Trash2 } from "lucide-react";
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
import { useRouter } from "next/navigation";
import AppDialog from "../AppDialog";
import { useDeleteExamFromStudent } from "@/server/backend/mutations/examMutations";
import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";
import { User } from "@/server/db/schema/users";
import AppNavigation from "../AppPagination";

interface Props {
  role?: string;
  student: User;
}

const MyExams = ({ student, role = "student" }: Props) => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data: studentExamsTest } = useStudentExams(student.id);
  const { data: studentExams, isFetching } = useStudentExamsPagination({
    studentId: student.id,
    page,
  });
  const { data: questionsCount } = useStudentExamsCount(student.id);
  const { mutate: deleteExamFromStudent } = useDeleteExamFromStudent();

  const allPages =
    (questionsCount && Math.ceil(questionsCount.count / 10)) ?? 1;

  const handleNextPage = () => {
    if (page < allPages) {
      setPage(page + 1);
    }
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      setPage(page - 1);
    }
  };

  useEffect(() => {
    queryClient.invalidateQueries({ queryKey: ["student-exams"] });
  }, [student, queryClient]);

  if (isFetching) {
    return (
      <div className="flex w-full mt-10 justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  if (!student.id) {
    return (
      <div className="flex w-full">
        <h2 className="text-3xl font-bold text-muted-foreground">
          Please select a Student
        </h2>
      </div>
    );
  }

  return (
    <Card className="bg-transparent dark:border-primary/40">
      <CardHeader>
        <CardTitle className="text-2xl font-bold">My Exams</CardTitle>
      </CardHeader>
      <CardContent>
        {studentExams?.length ? (
          <div className="flex flex-col gap-5">
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
                    <TableCell className="uppercase text-primary font-semibold">
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
                        <p className="font-semibold">{item.marks}/100</p>
                      ) : (
                        <Badge variant="destructive">pending</Badge>
                      )}
                    </TableCell>
                    {/* time */}
                    <TableCell className="text-start whitespace-nowrap">
                      {item.completedAt ? (
                        <p className="font-semibold">
                          {item.duration}min/60min
                        </p>
                      ) : (
                        <Badge variant="destructive">pending</Badge>
                      )}
                    </TableCell>

                    {/* admin - delete exam */}
                    {role === "admin" && (
                      // delete exam
                      <TableCell className="text-start">
                        <AppDialog
                          title="Delete Exam"
                          trigger={
                            <Trash2 className="text-red-500 w-5 h-5 cursor-pointer" />
                          }
                          body={<div>You you sure, delete this Exam</div>}
                          okDialog={() =>
                            deleteExamFromStudent({
                              studentId: student.id,
                              examId: item.examId,
                            })
                          }
                        />
                      </TableCell>
                    )}

                    {/* student - start exam */}
                    <TableCell className="text-start flex gap-4 items-center">
                      {role !== "admin" && (
                        <AppDialog
                          title="Start Exam"
                          body={
                            <div className="flex flex-col gap-1 font-semibold">
                              <div className="text-red-500 p-0 uppercase">
                                Please read carefully
                              </div>
                              <div className="flex flex-col">
                                <div className="flex gap-2 items-center">
                                  <div className="h-2 w-2 bg-red-500 animate-ping rounded-full duration-1000"></div>
                                  <span>You are about to start this Exam.</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <div className="h-2 w-2 bg-red-500 animate-ping rounded-full duration-1000"></div>
                                  <span>
                                    You have 40 MCQ questions and 1 Hour to
                                    complete.
                                  </span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <div className="h-2 w-2 bg-red-500 animate-ping rounded-full duration-1000"></div>
                                  <span>Clock is only for reference.</span>
                                </div>
                                <div className="flex gap-2 items-center">
                                  <div className="h-2 w-2 bg-red-500 animate-ping rounded-full duration-1000"></div>
                                  <span>
                                    You can continue doing Exam even after clock
                                    times up.
                                  </span>
                                </div>
                              </div>
                            </div>
                          }
                          trigger={
                            <Button
                              disabled={Boolean(item.completedAt)}
                              size="sm"
                            >
                              Start Exam
                            </Button>
                          }
                          okDialog={() =>
                            router.push(
                              `/student/exam/${item.examId}?studentId=${student.id}&studentName=${student.name}&role=${role}`
                            )
                          }
                        />
                      )}

                      {/* result sheet */}
                      {item.completedAt && (
                        <Link
                          href={`/student/completed-exam/${item.examId}?studentId=${student.id}&studentName=${student.name}&role=${role}`}
                        >
                          <Eye />
                        </Link>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            {allPages > 1 && (
              <AppNavigation
                page={page}
                setPage={setPage}
                allPages={allPages}
                handleNextPage={handleNextPage}
                handlePreviousPage={handlePreviousPage}
              />
            )}
          </div>
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
