import AddExamForm from "@/components/exams/AddExamForm";
import AllExams from "@/components/exams/AllExams";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const ExamsPage = () => {
  return (
    <div className="flex flex-col gap-10 w-full">
      <Card className="flex flex-col w-full h-fit">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Exam</CardTitle>
        </CardHeader>
        <CardContent>
          <AddExamForm />
        </CardContent>
      </Card>

      <Card>
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
