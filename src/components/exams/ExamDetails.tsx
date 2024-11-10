"use client";
import { useExamById } from "@/server/backend/queries/examQueries";
import { Loader2 } from "lucide-react";
import _ from "lodash";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import QuestionCard from "../questions/QuestionCard";
import { Question } from "@/server/db/schema/questions";
import { ExamQuestion } from "@/server/db/schema/examQuestions";
import ExamQuestionCard from "./ExamQuestionCard";
import StudentSelector from "../student/StudentSelector";
import { useState } from "react";
import { Button } from "../ui/button";
import { useAddExamToStudent } from "@/server/backend/mutations/examMutations";
import { toast } from "sonner";
import { Student, StudentExt } from "@/server/db/schema/students";
import { useRouter } from "next/navigation";
import { useStudents } from "@/server/backend/queries/studentQueries";
import { Badge } from "../ui/badge";

interface Props {
  examId: string;
  student: StudentExt;
}

const ExamDetails = ({ examId, student }: Props) => {
  const router = useRouter();
  const [selectedStudent, setSelectedStudent] = useState<null | StudentExt>(
    null
  );

  const { data: exam, isLoading } = useExamById(examId);
  const { data: allStudents } = useStudents();
  const { mutate: addExamToStudent } = useAddExamToStudent();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  const examStudentIds = exam?.studentExams.map((exam) => exam?.studentId);
  const examStudents = _.filter(allStudents, (student) =>
    _.includes(examStudentIds, student.id)
  );

  const assignExamToStudent = () => {
    console.log("selectedStudent", selectedStudent);
    if (!selectedStudent) return toast.error("Please select a Student");
    if (selectedStudent && examId) {
      addExamToStudent({
        studentId: selectedStudent.id,
        examId,
      });
    }
  };

  // console.log("Admin ExamDetails", exam);

  return (
    <Card className="flex flex-col">
      <CardHeader>
        <CardTitle className="flex justify-between">
          <div className="uppercase text-2xl font-bold">
            <span>{exam?.name}</span>, Exam Details
          </div>
          {exam && exam.examQuestions && (
            <div className="flex items-center gap-2">
              <p>Assign Exam to Student</p>
              <StudentSelector setSelectedStudent={setSelectedStudent} />
              <Button disabled={!selectedStudent} onClick={assignExamToStudent}>
                Assign
              </Button>
            </div>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="gap-4 flex flex-col h-full">
        {/* students having this exam */}
        <div className="flex gap-4">
          {examStudents.map((student) => (
            <Badge key={student.id}>{student.name}</Badge>
          ))}
        </div>

        {exam && exam.examQuestions.length ? (
          exam.examQuestions.map((item, index) => {
            return (
              <ExamQuestionCard
                key={index}
                question={item.questions}
                questionNumber={item.questionNumber}
                examId={examId}
                role={student.role}
              />
            );
          })
        ) : (
          <div className="flex items-center justify-center mt-10">
            <h1 className="text-xl font-bold text-muted-foreground">
              No Questions Found!
            </h1>
          </div>
        )}

        <Button className="w-fit self-end" onClick={() => router.back()}>
          Back
        </Button>
      </CardContent>
    </Card>
  );
};
export default ExamDetails;
