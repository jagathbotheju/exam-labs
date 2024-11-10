import ExamDetails from "@/components/exams/ExamDetails";
import { auth } from "@/lib/auth";
import { Student, StudentExt } from "@/server/db/schema/students";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}
const ExamDetailsPage = async ({ params }: Props) => {
  const session = await auth();
  const user = session?.user as StudentExt;

  if (!user || user.role !== "admin") return redirect("/not-authorized");

  return <ExamDetails examId={params.id} student={user} />;
};
export default ExamDetailsPage;
