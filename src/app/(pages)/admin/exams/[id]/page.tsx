import ExamDetails from "@/components/exams/ExamDetails";

interface Props {
  params: {
    id: string;
  };
}
const ExamDetailsPage = ({ params }: Props) => {
  return <ExamDetails examId={params.id} />;
};
export default ExamDetailsPage;
