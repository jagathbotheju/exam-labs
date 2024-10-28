import AllQuestions from "@/components/questions/AllQuestions";
import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";
import { redirect } from "next/navigation";

const QuestionsPage = async () => {
  const session = await auth();
  const user = session?.user as Student;

  if (!user || user.role !== "admin") return redirect("/not-authorized");

  return (
    <div className="flex flex-col border h-full p-4 w-full">
      <AllQuestions />
    </div>
  );
};
export default QuestionsPage;
