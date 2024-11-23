"use client";
import { useQuestionTypes } from "@/server/backend/queries/questionTypeQueries";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Loader2, Trash2 } from "lucide-react";
import _ from "lodash";
import AppDialog from "../AppDialog";
import { useDeleteQuestionType } from "@/server/backend/mutations/questionTypeMutations";

const AllQuestionTypes = () => {
  const { data: types, isLoading } = useQuestionTypes();
  const { mutate: deleteQuestionType } = useDeleteQuestionType();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  }

  if (_.isEmpty(types) || !types) {
    return (
      <div className="flex items-center justify-center">
        <h1 className="text-xl font-bold text-muted-foreground">
          No Question Types Found!, Please add one
        </h1>
      </div>
    );
  }

  return (
    <Table className="w-full md:max-w-xl">
      <TableHeader>
        <TableRow>
          <TableHead className="w-[100px]">ID</TableHead>
          <TableHead>Question Type</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {types.map((type) => (
          <TableRow key={type.id}>
            <TableCell className="font-medium whitespace-nowrap">
              {type.id}
            </TableCell>
            <TableCell>
              <p className="uppercase font-sinhala">{type.type}</p>
            </TableCell>
            <TableCell className="text-left text-slate-200">
              <AppDialog
                title="Delete Question Type"
                body={
                  <div>
                    <p className="text-lg font-semibold">
                      Are you sure you want to delete this Question Type
                    </p>
                  </div>
                }
                okDialog={() => deleteQuestionType(type.id)}
                trigger={<Trash2 className="w-4 cursor-pointer text-red-500" />}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};
export default AllQuestionTypes;
