import Profile from "@/components/profile/Profile";
import { auth } from "@/lib/auth";
import { Student } from "@/server/db/schema/students";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await auth();
  const user = session?.user as Student;
  if (!user) redirect("/auth/login");

  return (
    <div className="w-full">
      <Profile student={user} />
    </div>
  );
};
export default ProfilePage;
