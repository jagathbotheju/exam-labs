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
