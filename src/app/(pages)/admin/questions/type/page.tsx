import AddQuestionTypeForm from "@/components/questions/AddQuestionTypeForm";
import AllQuestionTypes from "@/components/questions/AllQuestionTypes";
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
      <Card className="flex flex-col w-full h-fit dark:bg-transparent dark:border-primary/40">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Add New Question Type
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AddQuestionTypeForm />
        </CardContent>
      </Card>

      <Card className="dark:bg-transparent dark:border-primary/40">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            All Question Types
          </CardTitle>
        </CardHeader>
        <CardContent>
          <AllQuestionTypes />
        </CardContent>
      </Card>
    </div>
  );
};
export default QuestionTypePage;
