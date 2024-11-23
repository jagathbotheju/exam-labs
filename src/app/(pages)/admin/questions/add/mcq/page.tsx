import AddMcqQuestionForm from "@/components/questions/AddMcqQuestionForm";
import { CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

const AddMcqQuestionPage = async () => {
  const session = await auth();
  const user = session?.user as User;

  if (!user || user.role !== "admin") return redirect("/not-authorized");
  return (
    <div className="w-full bg-slate-50 dark:bg-slate-900">
      <AddMcqQuestionForm />
    </div>
  );
};
export default AddMcqQuestionPage;
