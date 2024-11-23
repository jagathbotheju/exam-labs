import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

const AddStructuredQuestionPage = async () => {
  const session = await auth();
  const user = session?.user as User;

  if (!user || user.role !== "admin") return redirect("/not-authorized");

  return <div>AddStructuredQuestionPage</div>;
};
export default AddStructuredQuestionPage;
