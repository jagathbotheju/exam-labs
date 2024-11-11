import StudentExam from "@/components/student/StudentExam";
import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

const StudentCompletedExamPage = async ({ params }: Props) => {
  const session = await auth();
  const student = session?.user as Student;
  if (!student) redirect("/auth/login");

  // console.log("studentId", searchParams.studentId);

  return (
    <div className="w-full">
      <StudentExam examId={params.id} completed />
    </div>
  );
};
export default StudentCompletedExamPage;