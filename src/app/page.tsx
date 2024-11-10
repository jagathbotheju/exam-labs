import AdminDashboard from "@/components/admin/Results";
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
  if (student.role === "admin") redirect("/admin");

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <ResultSummary />
        <MyExams student={student} />
      </div>
    </div>
  );
}
