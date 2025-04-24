"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "@/app/components/Button";
import FloatingText from "@/app/components/FloatingText";
import TimeInput from "@/app/components/TimeInput";
import Time from "@/app/classes/Time";
import { toast } from "../components/Toast";
import BreadCrumb from "../components/BreadCrumb";
import Link from "next/link";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

const Page = () => {
  const [generatedSessions, setGeneratedSessions] = useState<
    { focus: number; break: number; id: string }[]
  >([]);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    const formData = new FormData(e.currentTarget);
    const learnPercentage = +(formData.get("learnPercentage") as string)
      .replace("%", "")
      .trim();
    const maxFocus = +(formData.get("maxFocus") as string)
      .replace("Minutes", "")
      .trim();
    let hourStart: Time;
    let hourEnd: Time;

    // #region validate valid values
    try {
      hourStart = new Time(formData.get("hourStart") as string);
    } catch (error) {
      toast("Invalid hour start values", "red");
      console.error(error);
      return;
    }

    try {
      hourEnd = new Time(formData.get("hourEnd") as string);
    } catch (error) {
      console.error(error);
      toast("Invalid hour end values", "red");
      return;
    }

    if (!learnPercentage) {
      toast("Learn Percentage Needed", "red");
    }

    if (!maxFocus) {
      toast("Max Focus Needed", "red");
    }

    // #endregion

    // Calculate pomodoro schedule
    const difference = hourStart.getDifference(hourEnd);
    console.log(difference);

    const totalFreeTime = difference.hours * 60 + difference.minutes;
    const totalLearnTime = (totalFreeTime * learnPercentage) / 100;
    const totalSessions = Math.floor(totalLearnTime / maxFocus);
    const remainingTime = totalLearnTime % maxFocus;
    const sessionChunks = Array.from({ length: totalSessions }, () => {
      return maxFocus;
    });
    if (remainingTime > 0) {
      sessionChunks.push(remainingTime);
    }
    const remainingFreeTime = totalFreeTime - totalLearnTime;
    const breakTime = remainingFreeTime / sessionChunks.length;
    let breakCarry = 0;
    const sessionWithBreaks = sessionChunks
      .map((chunk) => {
        const decimal = breakTime - Math.floor(breakTime);
        breakCarry += decimal;
        const bonus = Math.floor(breakCarry / 1);
        if (bonus > 0) {
          breakCarry = breakCarry % 1;
        }
        return {
          focus: chunk,
          break: Math.floor(breakTime) + bonus,
          id: uuidv4(),
        };
      })
      .flat();
    setGeneratedSessions(sessionWithBreaks);
  };

  return (
    <div className="py-8">
      <div className="bg-white shadow rounded space-y-8 p-4 py-8 md:p-8 max-w-7xl mx-auto">
        <BreadCrumb />
        <h2 className="font-cormorant font-semibold text-3xl">Rythm Rise</h2>
        <form
          className="grid gap-4 bg-inherit sm:grid-cols-2 md:grid-cols-4"
          onSubmit={handleSubmit}
        >
          <FloatingText
            name="learnPercentage"
            label="Learn Percentage"
            defaultValue={"30"}
            endOfValue="%"
          />
          <TimeInput label="Jam Mulai" name="hourStart" />
          <TimeInput label="Jam Selesai" name="hourEnd" />
          <FloatingText
            name="maxFocus"
            label="Max Focus"
            defaultValue={"15"}
            endOfValue="Minutes"
          />
          <Button type="submit">Calculate</Button>
        </form>
        {generatedSessions.length > 0 && (
          <>
            <div className="flex flex-col gap-2">
              <h3 className="font-cormorant font-medium text-2xl">
                Generated Sessions
              </h3>
              <ul className="flex flex-wrap gap-2">
                {generatedSessions.map((session) => (
                  <Session
                    break={session.break}
                    focus={session.focus}
                    key={session.id}
                  />
                ))}
              </ul>
            </div>
            <Link
              href={`/sol-cycle?scheme=${JSON.stringify(generatedSessions)}`}
              className="text-primary bg-red-100 px-4 py-2 pr-6 group rounded  shadow flex items-center gap-2 w-max interactable-red"
            >
              Open Scheme in Sol Cycle
              <ArrowRightCircleIcon className="size-6 group-hover:translate-x-4 transition-transform" />
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
export default Page;

function Session({
  focus,
  break: breakTime,
}: {
  focus: number;
  break: number;
}) {
  return (
    <>
      <li className=" font-medium bg-blue-100 text-blue-600 p-2 rounded-md">
        {focus}
      </li>
      <li className=" font-medium bg-emerald-100 text-emerald-600 p-2 rounded-md">
        {breakTime}
      </li>
    </>
  );
}
