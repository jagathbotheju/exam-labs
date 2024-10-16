import { useQuery } from "@tanstack/react-query";
import { getSubjects } from "../actions/subjectActions";

export const useSubjects = () => {
  return useQuery({
    queryKey: ["subjects"],
    queryFn: () => getSubjects(),
  });
};
