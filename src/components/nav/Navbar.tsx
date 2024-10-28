import Image from "next/image";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";
import AuthButton from "../auth/AuthButton";

const Navbar = async () => {
  const session = await auth();
  const student = session?.user as Student;

  return (
    <div className="border-b-[1.5px] border-b-primary">
      <nav className="max-w-7xl mx-auto px-10 pt-6 pb-4">
        <ul className="flex justify-between items-center">
          <li>
            <Link href="/" className="relative flex gap-2 items-center">
              <h1 className="text-center bg-gradient-to-r from-orange-400 to-red-900 bg-clip-text text-3xl font-bold text-transparent">
                ExamLabs
              </h1>
            </Link>
          </li>
          <li>
            <AuthButton student={student} />
          </li>
        </ul>
      </nav>
    </div>
  );
};
export default Navbar;
