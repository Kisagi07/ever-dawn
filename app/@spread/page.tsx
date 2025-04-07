"use client";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Button from "../components/Button";
import FloatingText from "../components/FloatingText";
import Surface from "../components/Surface";

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
    const totalFreeTime = +(formData.get("totalFreeTime") as string)
      .replace("Minutes", "")
      .trim();
    const maxFocus = +(formData.get("maxFocus") as string)
      .replace("Minutes", "")
      .trim();

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
    const sessionWithBreaks = sessionChunks
      .map((chunk) => {
        return { focus: chunk, break: breakTime, id: uuidv4() };
      })
      .flat();

    console.log("sessionWithBreaks", sessionWithBreaks);
    setGeneratedSessions(sessionWithBreaks);
  };

  return (
    <Surface level={1}>
      <h2 className="font-cormorant font-semibold text-3xl">Spread Learning</h2>
      <form className="grid grid-cols-3 gap-4" onSubmit={handleSubmit}>
        <FloatingText
          name="learnPercentage"
          label="Learn Percentage"
          defaultValue={"20"}
          endOfValue="%"
        />
        <FloatingText
          name="totalFreeTime"
          label="Total Free Time"
          defaultValue={"300"}
          endOfValue="Minutes"
        />
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
    </Surface>
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
