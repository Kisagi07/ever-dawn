import Time from "@/app/classes/Time";
import { v4 as uuidv4 } from "uuid";

const calculateRythmScheme = (
  hourStart: Time,
  hourEnd: Time,
  focusTarget: "percentage" | "today goal",
  maxFocus: number,
  { percentage = 0, todayGoal = 0 }
) => {
  const difference = hourStart.getDifference(hourEnd);

  const totalFreeTime = difference.hours * 60 + difference.minutes;
  let focusTotal = 0;

  if (focusTarget === "percentage") {
    const focusPercentage = percentage;
    focusTotal = (totalFreeTime * focusPercentage) / 100;
  } else {
    focusTotal = todayGoal;
  }

  const totalSessions = Math.floor(focusTotal / maxFocus);
  const remainingTime = focusTotal % maxFocus;
  const sessionChunks = Array.from({ length: totalSessions }, () => {
    return maxFocus;
  });
  if (remainingTime > 0) {
    sessionChunks.push(remainingTime);
  }
  const remainingFreeTime = totalFreeTime - focusTotal;
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

  return sessionWithBreaks;
};
export default calculateRythmScheme;
