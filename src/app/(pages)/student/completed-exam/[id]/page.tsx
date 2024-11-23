import StudentExam from "@/components/student/StudentExam";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
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
  const student = session?.user as User;
  if (!student) redirect("/auth/login");
  if (student.role !== searchParams.role) redirect("/not-authorized");

  return (
    <div className="w-full">
      <StudentExam examId={params.id} completed />
    </div>
  );
};
export default StudentCompletedExamPage;
