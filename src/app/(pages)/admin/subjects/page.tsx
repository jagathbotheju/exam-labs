import AddSubjectForm from "@/components/subjects/AddSubjectForm";
import AllSubjects from "@/components/subjects/AllSubjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

const SubjectsPage = async () => {
  const session = await auth();
  const user = session?.user as User;

  if (!user || user.role !== "admin") return redirect("/not-authorized");

  return (
    <div className="flex flex-col gap-10 w-full">
      <Card className="flex flex-col w-full h-fit dark:bg-transparent dark:border-primary/40">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <AddSubjectForm />
        </CardContent>
      </Card>

      <Card className="dark:bg-transparent dark:border-primary/40">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">All Subjects</CardTitle>
        </CardHeader>
        <CardContent>
          <AllSubjects />
        </CardContent>
      </Card>
    </div>
  );
};
export default SubjectsPage;
