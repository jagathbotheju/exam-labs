import Results from "@/components/admin/Results";
import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";
import { redirect } from "next/navigation";

const ResultsPage = async () => {
  const session = await auth();
  const student = session?.user as Student;
  if (!student) redirect("/auth/login");
  if (student.role !== "admin") redirect("/not-authorized");

  return (
    <div className="flex w-full">
      <Results admin={student} />
    </div>
  );
};
export default ResultsPage;
