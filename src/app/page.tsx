import MyExams from "@/components/exams/MyExams";
import ResultSummary from "@/components/student/ResultSummary";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const student = session?.user as User;

  if (!student) redirect("/auth/login");
  if (student.role === "admin") redirect("/admin");

  return (
    <div className="w-full">
      <div className="flex flex-col gap-8">
        <ResultSummary student={student} />
        <MyExams student={student} />
      </div>
    </div>
  );
}
