import { AlertCircle } from "lucide-react";

const FormError = ({ message }: { message?: string }) => {
  if (!message) return null;

  return (
    <div className="flex items-center justify-center gap-2 bg-destructive/70 text-secondary-foreground p-3 rounded-md w-[50%] mx-auto">
      <AlertCircle className="w-8 h-8" />
      <p>{message}</p>
    </div>
  );
};
export default FormError;
