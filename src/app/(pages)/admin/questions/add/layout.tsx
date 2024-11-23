import QuestionTypeToggle from "@/components/questions/QuestionTypeToggle";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface Props {
  children: React.ReactNode;
}

const AddQuestionLayout = ({ children }: Props) => {
  return (
    <div className="flex flex-col gap-10 w-full">
      <Card className="flex flex-col w-full h-fit dark:bg-slate-900 bg-slate-50">
        <CardHeader>
          <QuestionTypeToggle />
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
};
export default AddQuestionLayout;
