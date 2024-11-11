import AddExamForm from "@/components/exams/AddExamForm";
import AllExams from "@/components/exams/AllExams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";
import { redirect } from "next/navigation";

const ExamsPage = async () => {
  const session = await auth();
  const user = session?.user as Student;

  if (!user || user.role !== "admin") return redirect("/not-authorized");
  return (
    <div className="flex flex-col gap-10 w-full">
      <Card className="flex flex-col w-full h-fit bg-transparent dark:border-primary/40">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <AddExamForm />
        </CardContent>
      </Card>

      <Card className="bg-transparent dark:border-primary/40">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">All Exams</CardTitle>
        </CardHeader>
        <CardContent>
          <AllExams />
        </CardContent>
      </Card>
    </div>
  );
};
export default ExamsPage;
