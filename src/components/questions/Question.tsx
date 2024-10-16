import { Question } from "@/server/db/schema/questions";

interface Props {
  question: Question;
}

const QuestionCard = ({ question }: Props) => {
  return <div>Question</div>;
};
export default QuestionCard;
