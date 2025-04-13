"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "@/app/components/Button";
import FloatingText from "@/app/components/FloatingText";
import Surface from "@/app/components/Surface";
import TimeInput from "@/app/components/TimeInput";
import Time from "@/app/classes/Time";

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
    const hourStart = new Time(formData.get("hourStart") as string);
    const hourEnd = new Time(formData.get("hourEnd") as string);
    const difference = hourStart.getDifference(hourEnd);
    const totalFreeTime = difference.hours * 60 + difference.minutes;

    const totalLearnTime = (totalFreeTime * learnPercentage) / 100;
    const totalSessions = Math.floor(totalLearnTime / maxFocus);
    const remainingTime = totalLearnTime % maxFocus;
    const sessionChunks = Array.from({ length: totalSessions }, (_, i) => {
      return maxFocus;
    });
    if (remainingTime > 0) {
      sessionChunks.push(remainingTime);
    }
    const remainingFreeTime = totalFreeTime - totalLearnTime;
    const breakTime = remainingFreeTime / sessionChunks.length;
    // push break time into each session chunk
    let breakCarry = 0;
    const sessionWithBreaks = sessionChunks
      .map((chunk) => {
        const decimal = breakTime - Math.floor(breakTime);
        breakCarry += decimal;
        let bonus = Math.floor(breakCarry / 1);
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
    <div className="bg-white rounded shadow space-y-8 p-4 py-8">
      <h2 className="font-cormorant font-semibold text-3xl">Spread Learning</h2>
      <form className="grid gap-4 bg-inherit" onSubmit={handleSubmit}>
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
        <div className="flex flex-col gap-2">
          <h3 className="font-cormorant font-bold text-2xl">
            Generated Sessions
          </h3>
          <ul className="flex flex-wrap gap-2">
            {generatedSessions.map((session, index) => (
              <Session
                break={session.break}
                focus={session.focus}
                key={session.id}
              />
            ))}
          </ul>
        </div>
      )}
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
      <li className=" font-medium bg-orange-500 text-white p-2 rounded-md">
        {focus}
      </li>
      <li className=" font-medium bg-emerald-500 text-white p-2 rounded-md">
        {breakTime}
      </li>
    </>
  );
}
