import AddSubjectForm from "@/components/subjects/AddSubjectForm";
import AllSubjects from "@/components/subjects/AllSubjects";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const SubjectsPage = () => {
  return (
    <div className="flex flex-col gap-10 w-full">
      <Card className="flex flex-col w-full h-fit">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Add New Subject</CardTitle>
        </CardHeader>
        <CardContent>
          <AddSubjectForm />
        </CardContent>
      </Card>

      <Card>
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
