import MyExams from "@/components/student/MyExams";
import ResultSummary from "@/components/student/ResultSummary";
import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";
import { redirect } from "next/navigation";

export default async function Home() {
  const session = await auth();
  const student = session?.user as Student;

  if (!student) redirect("/auth/login");

  return (
    <div className="flex flex-col w-full gap-8">
      <ResultSummary />
      <MyExams student={student} />
    </div>
  );
}
