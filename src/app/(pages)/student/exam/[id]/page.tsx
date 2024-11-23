import StudentExam from "@/components/student/StudentExam";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

const StudentExamPage = async ({ params }: Props) => {
  const session = await auth();
  const student = session?.user as User;
  if (!student) redirect("/auth/login");

  return (
    <div className="w-full">
      <StudentExam examId={params.id} />
    </div>
  );
};
export default StudentExamPage;
