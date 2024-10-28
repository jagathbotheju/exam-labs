import AddMcqQuestionForm from "@/components/questions/AddMcqQuestionForm";
import { CardContent } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";
import { redirect } from "next/navigation";

const AddMcqQuestionPage = async () => {
  const session = await auth();
  const user = session?.user as Student;

  if (!user || user.role !== "admin") return redirect("/not-authorized");
  return (
    <div className="w-full">
      <AddMcqQuestionForm />;
    </div>
  );
};
export default AddMcqQuestionPage;
