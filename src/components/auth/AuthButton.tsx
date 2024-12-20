"use client";
import { Button } from "../ui/button";
import Link from "next/link";
import { LogIn, LogOutIcon, UserPen, UserRoundPen } from "lucide-react";
import { signOut } from "next-auth/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useState } from "react";
import Image from "next/image";
import { useTheme } from "next-themes";
import { useRouter } from "next/navigation";
import { ThemeSwitcher } from "../ThemeSwitcher";
import { User } from "@/server/db/schema/users";

interface Props {
  student: User;
}

const AuthButton = ({ student }: Props) => {
  const router = useRouter();
  const { setTheme, theme } = useTheme();
  const [checked, setChecked] = useState(false);

  return (
    <div className="flex items-center gap-2">
      {student ? (
        <div className="flex gap-4 items-center">
          <div className="flex flex-col">
            <h3 className="font-semibold text-xl">{student.name}</h3>
            <p className="text-xs text-muted-foreground">{student.email}</p>
          </div>
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger className="focus-visible:outline-none">
              <Avatar>
                <AvatarImage src={student.image ?? ""} alt="student" />
                <AvatarFallback>
                  <span className="text-amber-400 font-semibold">
                    {student.name?.slice(0, 2).toUpperCase()}
                  </span>
                </AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-60 p-2" align="end">
              {/* avatar */}
              <div className="mb-2 p-2 flex flex-col gap-1 items-center bg-primary/25 rounded-lg">
                <Image
                  className="rounded-full"
                  src={student.image ? student.image : "/images/no-image.svg"}
                  alt="profile image"
                  width={36}
                  height={36}
                />
                <p className="font-bold text-xs">{student.name}</p>
                <span className="text-xs font-medium text-secondary-foreground">
                  {student.email}
                </span>
              </div>

              {/* profiles */}
              <DropdownMenuItem
                onClick={() => router.push("/student/profile")}
                className="font-medium transition-all duration-500 cursor-pointer group ease-in-out"
              >
                <UserRoundPen className="mr-2 w-4 group-hover:translate-x-1 transition-all duration-300 ease-in-out" />
                <span className="">Profile</span>
              </DropdownMenuItem>

              {/* theme switch */}
              <DropdownMenuItem
                className="font-medium transition-all duration-500 cursor-pointer group ease-in-out"
                onClick={(e) => {
                  e.stopPropagation();
                  setTheme(theme === "dark" ? "light" : "dark");
                }}
              >
                <ThemeSwitcher />
              </DropdownMenuItem>

              {/* admin */}
              {student && student.role === "admin" && (
                <DropdownMenuItem
                  className="font-medium transition-all duration-500 cursor-pointer group ease-in-out"
                  onClick={() => router.push("/admin")}
                >
                  <LogOutIcon className="mr-2 w-4 group-hover:rotate-180 transition-all duration-300 ease-in-out" />
                  <span>Admin</span>
                </DropdownMenuItem>
              )}

              {/* logout */}
              <DropdownMenuItem
                className="font-medium transition-all duration-500 cursor-pointer group ease-in-out"
                onClick={() => signOut()}
              >
                <LogOutIcon className="mr-2 w-4 group-hover:rotate-180 transition-all duration-300 ease-in-out" />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      ) : (
        <>
          <Button asChild size="sm">
            <Link href="/auth/login" className="flex items-center gap-1">
              <LogIn size={16} />
              <span>Login</span>
            </Link>
          </Button>
          <Button asChild size="sm">
            <Link href="/auth/register" className="flex items-center gap-1">
              <UserPen size={16} />
              <span>Register</span>
            </Link>
          </Button>
        </>
      )}
    </div>
  );
};
export default AuthButton;
