"use client";
import { addMinutes, getMinutes, format, subMinutes } from "date-fns";
import { useEffect, useState } from "react";
import Countdown, { zeroPad } from "react-countdown";

interface Props {
  examDurationMin: number;
}

const ExamTimer = ({ examDurationMin }: Props) => {
  const [bgColor, setBgColor] = useState("#000000");

  return (
    <Countdown
      date={addMinutes(new Date(), examDurationMin)}
      renderer={({ hours, minutes, seconds, completed }) => (
        <div className="flex border border-primary/40 rounded-md items-center fixed z-50 right-[15%] dark:bg-slate-900">
          <div className="text-2xl p-2 font-bold">
            <span>{zeroPad(hours)}</span>
          </div>
          <span>:</span>
          <div className="text-2xl p-2 font-bold">
            <span>{zeroPad(minutes)}</span>
          </div>
          <span>:</span>
          <div className="text-2xl p-2 font-bold">
            <span>{zeroPad(seconds)}</span>
          </div>
          {/* {zeroPad(hours)}:{zeroPad(minutes)}:{zeroPad(seconds)} */}
        </div>
      )}
    />
  );
};
export default ExamTimer;
