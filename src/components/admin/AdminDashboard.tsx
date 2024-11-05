"use client";
import { useStudents } from "@/server/backend/queries/studentQueries";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import MyExams from "../exams/MyExams";
import { Loader2 } from "lucide-react";
import { Student } from "@/server/db/schema/students";

interface Props {
  admin: Student;
}

const AdminDashboard = ({ admin }: Props) => {
  const { data: students, isPending } = useStudents();
  const allStudents = students?.filter((student) => student.role !== "admin");

  console.log("students", allStudents);

  if (isPending) {
    return (
      <div className="flex w-full mt-10 justify-center items-center">
        <Loader2 className="animate-spin w-8 h-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      <Card>
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Student Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col">
            {allStudents ? (
              allStudents.map((student) => (
                <div key={student.id} className="flex flex-col gap-4">
                  <h2 className="text-xl font-semibold underline">
                    {student.name}
                  </h2>
                  <MyExams studentId={student.id} role={admin.role} />
                </div>
              ))
            ) : (
              <div className="w-full mt-8">
                <h2 className="text-3xl font-semibold text-muted-foreground">
                  No Students Found!
                </h2>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
export default AdminDashboard;
