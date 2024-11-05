import AdminDashboard from "@/components/admin/AdminDashboard";
import MyExams from "@/components/exams/MyExams";
import ResultSummary from "@/components/student/ResultSummary";
import StudentTest from "@/components/student/StudentTest";
import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const student = session?.user as Student;

  if (!student) redirect("/auth/login");

  return (
    <div className="w-full">
      {student && student.role === "admin" ? (
        <AdminDashboard admin={student} />
      ) : (
        <div className="flex flex-col gap-8">
          <ResultSummary />
          <MyExams studentId={student.id} />
        </div>
      )}
    </div>
  );
}
