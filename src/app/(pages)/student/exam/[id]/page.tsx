import StudentExam from "@/components/student/StudentExam";
import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";

interface Props {
  params: {
    id: string;
  };
}

const StudentExamPage = async ({ params }: Props) => {
  const session = await auth();
  const student = session?.user as Student;

  return (
    <div className="w-full">
      <StudentExam examId={params.id} student={student} />
    </div>
  );
};
export default StudentExamPage;
