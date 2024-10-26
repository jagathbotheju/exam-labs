import { Student } from "@/server/db/schema/students";
import { type DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: DefaultUser & Student;
  }
}
