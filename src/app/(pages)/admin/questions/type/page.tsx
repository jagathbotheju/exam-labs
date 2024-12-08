import AddQuestionTypeForm from "@/components/questions/AddQuestionTypeForm";
import AllQuestionTypes from "@/components/questions/AllQuestionTypes";
import QuestionTypes from "@/components/questions/QuestionTypes";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

const QuestionTypePage = async () => {
  const session = await auth();
  const user = session?.user as User;

  if (!user || user.role !== "admin") return redirect("/not-authorized");

  return (
    <div className="flex flex-col gap-10 w-full">
      <QuestionTypes />
    </div>
  );
};
export default QuestionTypePage;
