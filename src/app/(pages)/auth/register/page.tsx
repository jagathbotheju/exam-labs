import RegisterForm from "@/components/auth/RegisterForm";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

const RegisterPage = async () => {
  const session = await auth();
  const student = session?.user;

  if (student) redirect("/");

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <RegisterForm />
    </div>
  );
};

export default RegisterPage;
