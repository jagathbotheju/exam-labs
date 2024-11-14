"use client";
import { useExamTimer } from "@/lib/utils";
import FlipClockCountdown from "@leenguyen/react-flip-clock-countdown";
import "@leenguyen/react-flip-clock-countdown/dist/index.css";
import { addMinutes, getMinutes, format, subMinutes } from "date-fns";
import { useEffect, useState } from "react";

interface Props {
  examDuration: number;
}

const ExamTimer = () => {
  const [bgColor, setBgColor] = useState("#000000");

  useEffect(() => {
    setBgColor("#000000");
  }, []);

  return (
    <div className="flex justify-center items-center text-5xl dark:bg-slate-700 p-2 rounded-md fixed z-50 right-[15%]">
      <FlipClockCountdown
        to={addMinutes(new Date().getTime(), 60)}
        renderMap={[false, true, true, true]}
        hideOnComplete={false}
        digitBlockStyle={{
          width: 30,
          height: 40,
          fontSize: 20,
          background: "#000000",
        }}
        showLabels={false}
        separatorStyle={{ color: bgColor }}
        onTick={({ timeDelta }) => {
          if (timeDelta.minutes < 10 && timeDelta.seconds < 0)
            setBgColor("#e74c3c");
        }}
      />
    </div>
  );
};
export default ExamTimer;
