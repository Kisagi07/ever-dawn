import Time from "@/app/classes/Time";
import { v4 as uuidv4 } from "uuid";

const calculateRythmScheme = (
  hourStart: Time,
  hourEnd: Time,
  focusTarget: "percentage" | "today goal",
  maxFocus: number,
  { percentage = 0, todayGoal = 0, startWithBreak = false }
) => {
  const difference = hourStart.getDifference(hourEnd);
  maxFocus *= 60;

  // get total free time in seconds
  const totalFreeTime = (difference.hours * 60 + difference.minutes) * 60;
  let focusTotal = 0;

  if (focusTarget === "percentage") {
    const focusPercentage = percentage;
    // get total focus in seconds
    focusTotal = (totalFreeTime * focusPercentage) / 100;
  } else {
    // get today goal in seconds
    focusTotal = todayGoal * 60;
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
  const breakTime = Math.round(remainingFreeTime / (sessionChunks.length + (startWithBreak ? 1 : 0)));

  const sessionWithBreaks: { focus?: number; break: number; id: string }[] = [];
  if (startWithBreak) {
    sessionWithBreaks.push({ break: breakTime, id: uuidv4() });
  }

  sessionChunks.forEach((chunk) => {
    sessionWithBreaks.push({ focus: chunk, break: breakTime, id: uuidv4() });
  });

  return sessionWithBreaks;
};
export default calculateRythmScheme;
