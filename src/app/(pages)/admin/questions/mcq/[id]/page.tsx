import { useQuestionById } from "@/server/backend/queries/questionQueries";
import AddMcqQuestionForm from "@/components/questions/AddMcqQuestionForm";

interface Props {
  params: {
    id: string;
  };
}

const QuestionDetailsPage = ({ params }: Props) => {
  return (
    <div className="flex flex-col w-full gap-2">
      <h1 className="text-3xl font-bold"></h1>
      <AddMcqQuestionForm questionId={params.id} />;
    </div>
  );
};
export default QuestionDetailsPage;
