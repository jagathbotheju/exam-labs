import { CheckCircle2 } from "lucide-react";

const FormSuccess = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-teal-400/70 text-secondary-foreground p-3 rounded-md w-full mt-4 text-center">
      <CheckCircle2 className="w-12 h-13" />
      <p>{message}</p>
    </div>
  );
};
export default FormSuccess;
