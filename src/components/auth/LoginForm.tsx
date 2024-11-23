"use client";
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
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { LoginSchema } from "@/lib/schema";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Card, CardContent, CardFooter, CardHeader } from "../ui/card";
import Image from "next/image";
import FormError from "../FormError";
import FormSuccess from "../FormSuccess";
import {
  emailSignIn,
  socialSignIn,
} from "@/server/backend/actions/authActions";

interface Props {
  callbackUrl?: string;
}

const LoginForm = ({ callbackUrl }: Props) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });

  // const [error, setError] = useState("");
  // const [success, setSuccess] = useState("");

  const onSubmit = (formData: z.infer<typeof LoginSchema>) => {
    startTransition(() => {
      // execute(formData);
      emailSignIn(formData)
        .then((res) => {
          if (res.success) {
            router.push("/");
            return toast.success(res.success);
          }
          if (res.error) {
            return toast.error(res.error);
          }
        })
        .catch((err) => {
          return toast.error("Invalid Credentials");
        });
    });
  };

  return (
    <div className="flex items-center justify-center flex-col w-full">
      <Card className="w-full md:w-[400px]">
        <CardHeader>
          <h1 className="mb-10 text-center bg-gradient-to-r from-orange-400 to-orange-500 bg-clip-text text-3xl font-bold text-transparent">
            Log In
          </h1>
        </CardHeader>
        <CardContent className="w-full">
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-6 flex flex-col w-full"
              noValidate
            >
              {/* email */}
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={isPending}
                        placeholder="your.email@example.com"
                        type="email"
                        className="dark:bg-slate-600 w-full"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* password */}
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <FormControl>
                      <div className="flex relative">
                        <Input
                          {...field}
                          disabled={isPending}
                          type={showPass ? "text" : "password"}
                          className="dark:bg-slate-600"
                          onChange={(value) => {
                            field.onChange(value);
                          }}
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

              {/* submit button */}
              <Button
                type="submit"
                className="w-full"
                disabled={!form.formState.isValid}
              >
                {isPending && <Loader2 className="mr-2 animate-spin" />}
                Log In
              </Button>
            </form>

            {/* reset password */}
            <div className="flex flex-col items-center">
              <Link
                href="/auth/reset-password"
                className="text-xs self-end cursor-pointer hover:text-primary mt-2"
              >
                forgot password?
              </Link>
            </div>
          </Form>
        </CardContent>

        <CardFooter className="flex flex-col">
          <div className="flex items-center gap-x-5 mb-4">
            <div className="flex bg-slate-200 w-20 h-[0.5px]" />
            <span className="text-center text-xs">or sign in with</span>
            <div className="flex bg-slate-200 w-20 h-[0.5px]" />
          </div>
          {/* google login */}
          <Button
            type="button"
            className="w-full mb-3"
            variant="secondary"
            onClick={() =>
              socialSignIn({ social: "google", callback: callbackUrl ?? "/" })
            }
          >
            <div className="relative mr-2">
              <Image
                alt="google logo"
                src="/images/google-icon.svg"
                className="top-0 left-0 relative"
                width={20}
                height={20}
              />
            </div>
            Google
          </Button>

          <Link
            href="/auth/register"
            className="text-xs hover:text-primary mt-5"
          >
            {"Don't have an Account? Create New"}
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
};

export default LoginForm;
