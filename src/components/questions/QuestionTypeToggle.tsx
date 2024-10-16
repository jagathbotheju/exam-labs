"use client";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "../ui/button";
import { CardTitle } from "../ui/card";

const QuestionTypeToggle = () => {
  const pathname = usePathname();
  const router = useRouter();

  return (
    <div className="flex justify-between w-full">
      <CardTitle className="text-2xl font-bold">
        Add New {pathname === "/admin/questions/add/mcq" ? "MCQ" : "Structured"}{" "}
        Question
      </CardTitle>
      <div className="flex gap-2">
        <Button
          onClick={() => router.push("/admin/questions/add/mcq")}
          variant={
            pathname === "/admin/questions/add/mcq" ? "default" : "outline"
          }
        >
          MCQ
        </Button>
        <Button
          onClick={() => router.push("/admin/questions/add/structured")}
          variant={
            pathname === "/admin/questions/add/structured"
              ? "default"
              : "outline"
          }
        >
          STRUCTURED
        </Button>
      </div>
    </div>
  );
};
export default QuestionTypeToggle;
