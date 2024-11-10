import { useQuery } from "@tanstack/react-query";
import { getStudentById, getStudents } from "../actions/studentActions";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => getStudents(),
  });
};

export const useStudentById = (studentId: string) => {
  return useQuery({
    queryKey: ["student-by-id"],
    queryFn: () => getStudentById(studentId),
  });
};
