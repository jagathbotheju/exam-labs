import Profile from "@/components/profile/Profile";
import { auth } from "@/lib/auth";
import { User } from "@/server/db/schema/users";
import { redirect } from "next/navigation";

const ProfilePage = async () => {
  const session = await auth();
  const user = session?.user as User;
  if (!user) redirect("/auth/login");

  return (
    <div className="w-full">
      <Profile student={user} />
    </div>
  );
};
export default ProfilePage;
