import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";
import { redirect } from "next/navigation";

const AddStructuredQuestionPage = async () => {
  const session = await auth();
  const user = session?.user as Student;

  if (!user || user.role !== "admin") return redirect("/not-authorized");

  return <div>AddStructuredQuestionPage</div>;
};
export default AddStructuredQuestionPage;
