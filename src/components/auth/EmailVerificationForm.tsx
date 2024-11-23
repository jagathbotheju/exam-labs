"use client";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import FormSuccess from "../FormSuccess";
import FormError from "../FormError";
import { verifyEmailToken } from "@/server/backend/actions/tokenActions";

interface Props {
  token: string;
}

const EmailVerificationForm = ({ token }: Props) => {
  const router = useRouter();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleVerification = useCallback(() => {
    if (success || error) return;

    verifyEmailToken(token).then((data) => {
      if (data.error) {
        setError(data.error);
      }
      if (data.success) {
        setSuccess(data.success);
      }
    });
  }, [error, token, success]);

  useEffect(() => {
    handleVerification();
  }, [handleVerification]);

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-center my-6 text-2xl">
          Verify your Email Account
        </CardTitle>
        <CardContent className="flex items-center flex-co w-full justify-center">
          <p>{!success && !error && "Verifying Email..."}</p>
          {success && (
            <div className="flex flex-col gap-4 w-full">
              <FormSuccess message={success} />
            </div>
          )}

          {error && <FormError message={error} />}
        </CardContent>
      </CardHeader>
    </Card>
  );
};
export default EmailVerificationForm;
