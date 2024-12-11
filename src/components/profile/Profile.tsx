"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "../ui/card";
import { useState, useTransition } from "react";
import { Edit, Edit2, Loader2 } from "lucide-react";
import { Switch } from "../ui/switch";
import { Eye, EyeOff } from "lucide-react";
import { toast } from "sonner";
import { useUploadThing } from "@/lib/uploadthing";
import { ProfileSchema } from "@/lib/schema";
import ImageUpload from "../ImageUpload";
import { useUpdateProfile } from "@/server/backend/mutations/studentMutations";
import { User } from "@/server/db/schema/users";

interface Props {
  student: User;
}

const Profile = ({ student }: Props) => {
  const [isPending, startTransition] = useTransition();
  const [showPass, setShowPass] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const { startUpload } = useUploadThing("imageUploader");

  const form = useForm<z.infer<typeof ProfileSchema>>({
    resolver: zodResolver(ProfileSchema),
    defaultValues: {
      name: student.name || undefined,
      image: student.image ? student.image : "",
      password: undefined,
      confirmPassword: undefined,
    },
    mode: "all",
  });

  const { mutate: updateProfile, error } = useUpdateProfile();

  const onSubmit = (formData: z.infer<typeof ProfileSchema>) => {
    startTransition(async () => {
      if (files.length > 0) {
        const uploadedImages = await startUpload(files);
        if (!uploadedImages) return;
        formData.image = uploadedImages[0].url;
      }
      updateProfile({ formData, studentId: student.id });
    });
  };

  return (
    <div className="flex w-full flex-col gap-4 mb-10 mt-4">
      <Card className="dark:bg-slate-900 border-primary/40">
        <CardHeader>
          <div className="flex justify-between w-full">
            <div className="flex flex-col gap-2">
              <CardTitle className="text-2xl font-bold">
                {student.name}, Profile Settings
              </CardTitle>
              <CardDescription className="text-sm">
                {student.email}
              </CardDescription>
            </div>
            <Edit
              className="w-8 h-8 cursor-pointer"
              onClick={() => setEditMode(!editMode)}
            />
          </div>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col gap-4"
            >
              <div className="flex gap-8">
                {/* profile image */}
                <FormField
                  control={form.control}
                  name="image"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <ImageUpload
                          value={field.value}
                          onChange={(url) => field.onChange(url)}
                          setFiles={setFiles}
                          editMode={!editMode}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />

                <div className="flex flex-col w-[50%] gap-4">
                  {/* name */}
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Name</FormLabel>
                        <FormControl>
                          <Input disabled={!editMode} {...field} />
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
                              disabled={!editMode}
                              type={showPass ? "text" : "password"}
                            />
                            <span
                              className="absolute top-3 right-2 cursor-pointer"
                              onClick={() => setShowPass(!showPass)}
                            >
                              {showPass ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
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
                              disabled={!editMode}
                              type={showPass ? "text" : "password"}
                            />
                            <span
                              className="absolute top-3 right-2 cursor-pointer"
                              onClick={() => setShowPass(!showPass)}
                            >
                              {showPass ? (
                                <Eye size={16} />
                              ) : (
                                <EyeOff size={16} />
                              )}
                            </span>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <Button
                className="w-fit self-end"
                disabled={!form.formState.isValid || isPending || !editMode}
                type="submit"
              >
                {isPending && <Loader2 className="mr-2 animate-spin" />}{" "}
                {isPending ? "Updating..." : "Update"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};
export default Profile;
