"use client";
import { useDeleteSubject } from "@/server/backend/mutations/subjectMutations";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useDeleteExam } from "@/server/backend/mutations/examMutations";

interface Props {
  trigger: React.ReactNode;
  examTitle: string;
  examId: string;
}

const DeleteExamDialog = ({ trigger, examTitle, examId }: Props) => {
  const { mutate } = useDeleteExam();
  const [open, setOpen] = useState(false);
  // console.log("examId delete exam", examId);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Delete Subject</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col">
          <p>
            Are you sure, to delete this{" "}
            <span className="font-semibold text-red-500 uppercase">
              {examTitle}
            </span>{" "}
            Exam.
          </p>

          <p>
            All the <span className="font-semibold">Questions</span>, related to
            this Exam will also be deleted!
          </p>
        </div>
        <DialogFooter>
          <Button
            variant="destructive"
            type="submit"
            onClick={() => {
              mutate(examId);
              setOpen(false);
            }}
          >
            Delete
          </Button>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default DeleteExamDialog;
