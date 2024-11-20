import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTimer } from "react-timer-hook";
import { addMinutes, getMinutes } from "date-fns";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const useExamTimer = () => {
  const {
    totalSeconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    resume,
    restart,
  } = useTimer({
    expiryTimestamp: addMinutes(new Date().getTime(), 5),
    onExpire: () => console.warn("onExpire called"),
  });

  return { seconds, minutes };
};

export const formatPrice = (amount: number, code: string) => {
  if (!code) return "0";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: code,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
