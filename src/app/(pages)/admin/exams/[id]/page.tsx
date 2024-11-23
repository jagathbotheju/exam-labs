import ExamDetails from "@/components/exams/ExamDetails";
import { auth } from "@/lib/auth";
import { UserExt } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}
const ExamDetailsPage = async ({ params }: Props) => {
  const session = await auth();
  const user = session?.user as UserExt;

  if (!user || user.role !== "admin") return redirect("/not-authorized");

  return <ExamDetails examId={params.id} student={user} />;
};
export default ExamDetailsPage;
