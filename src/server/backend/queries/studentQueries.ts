import { useQuery } from "@tanstack/react-query";
import { getStudents } from "../actions/studentActions";

export const useStudents = () => {
  return useQuery({
    queryKey: ["students"],
    queryFn: () => getStudents(),
  });
};
