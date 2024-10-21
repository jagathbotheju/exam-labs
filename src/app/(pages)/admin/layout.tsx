"use client";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface Props {
  children: React.ReactNode;
}

const AdminLayout = ({ children }: Props) => {
  const pathname = usePathname();

  return (
    <div className="flex gap-5 w-full">
      <div className="flex flex-col gap-2 w-[200px] bg-slate-100 h-full p-5 rounded-md border">
        {/* all questions */}
        <Button
          asChild
          variant={pathname === "/admin/questions" ? "default" : "outline"}
        >
          <Link href="/admin/questions">All Questions</Link>
        </Button>

        {/* add MCQ */}
        <Button
          asChild
          variant={
            pathname === "/admin/questions/add/mcq" ? "default" : "outline"
          }
        >
          <Link href="/admin/questions/add/mcq">Add MCQ</Link>
        </Button>

        {/* add structured */}
        <Button
          asChild
          variant={
            pathname === "/admin/questions/add/structured"
              ? "default"
              : "outline"
          }
        >
          <Link href="/admin/questions/add/structured">Add Structured</Link>
        </Button>

        {/* subjects */}
        <Button
          asChild
          variant={pathname === "/admin/subjects" ? "default" : "outline"}
        >
          <Link href="/admin/subjects">Subjects</Link>
        </Button>

        {/* exams */}
        <Button
          asChild
          variant={pathname === "/admin/exams" ? "default" : "outline"}
        >
          <Link href="/admin/exams">Exams</Link>
        </Button>
      </div>
      <div className="w-full">{children}</div>
    </div>
  );
};
export default AdminLayout;
