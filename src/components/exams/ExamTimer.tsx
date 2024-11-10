"use client";
import { useExamTimer } from "@/lib/utils";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { addMinutes, getMinutes, format, subMinutes } from "date-fns";
import { useEffect, useState } from "react";

interface Props {
  examDuration: number;
}

const ExamTimer = ({ examDuration }: Props) => {
  const [bgColor, setBgColor] = useState("#000000");
  const startTime = new Date();

  useEffect(() => {
    setBgColor("#000000");
  }, []);

  return (
    <div className="flex justify-center items-center text-5xl bg-transparent p-2 rounded-md fixed top-5 left-0 right-0 z-50 mx-auto">
      <FlipClockCountdown
        to={addMinutes(new Date().getTime(), examDuration)}
        renderMap={[false, true, true, true]}
        hideOnComplete={false}
        onChange={(value) => console.log(value)}
        digitBlockStyle={{
          width: 30,
          height: 40,
          fontSize: 20,
          background: bgColor,
        }}
        showLabels={false}
        separatorStyle={{ color: bgColor }}
        onTick={({ timeDelta }) => {
          if (timeDelta.minutes < 10 && timeDelta.seconds < 0)
            setBgColor("#e74c3c");
        }}
        onComplete={() => {
          const endTime = new Date();
          const duration =
            Math.abs((endTime.getTime() - startTime.getTime()) / 1000) / 60;
        }}
      />
    </div>
  );
};
export default ExamTimer;
