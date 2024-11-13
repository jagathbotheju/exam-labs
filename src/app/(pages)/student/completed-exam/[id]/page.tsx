import StudentExam from "@/components/student/StudentExam";
import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    role: string;
  };
}

const StudentCompletedExamPage = async ({ params, searchParams }: Props) => {
  const session = await auth();
  const student = session?.user as Student;
  if (!student) redirect("/auth/login");
  if (student.role !== searchParams.role) redirect("/not-authorized");
  // console.log("studentId", searchParams.studentId);

  return (
    <div className="w-full">
      <StudentExam examId={params.id} completed />
    </div>
  );
};
export default StudentCompletedExamPage;
