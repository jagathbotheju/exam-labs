"use client";
import { RegisterSchema } from "@/lib/schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import { useState, useTransition } from "react";
import { FaGoogle } from "react-icons/fa";
import { format } from "date-fns";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  CalendarIcon,
  Check,
  ChevronsUpDown,
  Eye,
  EyeOff,
  Loader2,
} from "lucide-react";
import { Card, CardContent, CardHeader } from "../ui/card";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { cn } from "@/lib/utils";
// import { Calendar } from "../ui/calendar";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import { grades } from "@/lib/constants";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "../ui/command";
import FormSuccess from "../FormSuccess";
import FormError from "../FormError";
import { useRegisterUser } from "@/server/backend/mutations/authMutations";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const RegisterForm = () => {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [value, onChange] = useState<Value>(new Date());
  const [openGrade, setOpenGrade] = useState(false);
  const {
    mutate: registerUser,
    isPending,
    isSuccess,
    isError,
    error,
  } = useRegisterUser();
  const form = useForm<z.infer<typeof RegisterSchema>>({
    resolver: zodResolver(RegisterSchema),
    defaultValues: {
      email: "",
      name: "",
      dob: new Date(),
      school: "",
      grade: "",
      password: "",
      confirmPassword: "",
    },
    mode: "all",
  });

  // const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");
  // const { isExecuting, execute } = useAction(registerUser, {
  //   onSuccess: ({ data }) => {
  //     if (data?.error) setError(data.error);
  //     if (data?.success) setSuccess(data.success);
  //   },
  // });

  const onSubmit = (formData: z.infer<typeof RegisterSchema>) => {
    console.log(formData);
    registerUser({ formData });
  };

  return (
    <>
      <Card className="w-full md:w-[500px]">
        <CardHeader>
          <h1 className="mb-4 text-center bg-gradient-to-r from-orange-400 to-red-900 bg-clip-text text-3xl font-bold text-transparent">
            Register Student
          </h1>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-5"
              noValidate
            >
              {/* name */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Name</FormLabel>
                    <FormControl>
                      <Input {...field} className="dark:bg-slate-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* email */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="your.email@example.com"
                        type="email"
                        className="dark:bg-slate-600"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex gap-4 w-full">
                {/* DOB */}
                <FormField
                  disabled={isPending}
                  control={form.control}
                  name="dob"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Date of birth</FormLabel>
                      <Popover>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant={"outline"}
                              className={cn(
                                "w-full pl-3 text-left font-normal",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value ? (
                                format(field.value, "PPP")
                              ) : (
                                <span>Pick a date</span>
                              )}
                              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            value={field.value}
                            onChange={field.onChange}
                            // disabled={(date) =>
                            //   date > new Date() || date < new Date("1900-01-01")
                            // }
                            // initialFocus
                          />
                        </PopoverContent>
                      </Popover>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* grade */}
                <FormField
                  control={form.control}
                  name="grade"
                  render={({ field }) => (
                    <FormItem className="flex flex-col w-full">
                      <FormLabel>Grade</FormLabel>
                      <Popover open={openGrade} onOpenChange={setOpenGrade}>
                        <PopoverTrigger asChild>
                          <FormControl>
                            <Button
                              variant="outline"
                              role="combobox"
                              className={cn(
                                "justify-between",
                                !field.value && "text-muted-foreground"
                              )}
                            >
                              {field.value
                                ? grades?.find((grade) => grade === field.value)
                                : "Select grade"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </FormControl>
                        </PopoverTrigger>
                        <PopoverContent className="w-[200px] p-0">
                          <Command>
                            <CommandInput placeholder="Search subjects..." />
                            <CommandList>
                              <CommandEmpty>No grades found.</CommandEmpty>
                              <CommandGroup>
                                {grades?.map((grade) => (
                                  <CommandItem
                                    key={grade}
                                    value={grade}
                                    onSelect={() => {
                                      form.setValue("grade", grade);
                                      setOpenGrade(false);
                                      form.trigger("grade");
                                    }}
                                  >
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        grade === field.value
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                    {grade}
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              {/* school */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="school"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>School</FormLabel>
                    <FormControl>
                      <Input {...field} className="dark:bg-slate-600" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="flex relative">
                        <Input
                          {...field}
                          type={showPass ? "text" : "password"}
                          className="dark:bg-slate-600"
                        />
                        <span
                          className="absolute top-3 right-2 cursor-pointer"
                          onClick={() => setShowPass(!showPass)}
                        >
                          {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/*confirm password */}
              <FormField
                disabled={isPending}
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Confirm Password</FormLabel>
                    <FormControl>
                      <div className="flex relative">
                        <Input
                          {...field}
                          type={showPass ? "text" : "password"}
                          className="dark:bg-slate-600"
                        />
                        <span
                          className="absolute top-3 right-2 cursor-pointer"
                          onClick={() => setShowPass(!showPass)}
                        >
                          {showPass ? <Eye size={16} /> : <EyeOff size={16} />}
                        </span>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="flex flex-col gap-3 items-center py-5">
                <Button
                  type="submit"
                  disabled={!form.formState.isValid}
                  className="w-full"
                >
                  {isPending && <Loader2 />} Register
                </Button>

                <Link
                  href="/auth/login"
                  className="text-xs hover:text-orange-300 mt-2"
                >
                  {"Already have an Account? Log In"}
                </Link>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>

      {isSuccess && (
        <FormSuccess message="We sent a confirmation Email, please check your Email" />
      )}
      {isError && <FormError message={error.message} />}
    </>
  );
};

export default RegisterForm;
