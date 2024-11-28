import IncorrectQuestions from "@/components/questions/IncorrectQuestions";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

const IncorrectQuestionsPage = async () => {
  const session = await auth();
  const user = session?.user as User;

  if (!user || user.role !== "admin") return redirect("/not-authorized");

  return (
    <div className="flex flex-col border rounded-md dark:border-primary/40 h-full p-4 w-full">
      <IncorrectQuestions />
    </div>
  );
};
export default IncorrectQuestionsPage;
