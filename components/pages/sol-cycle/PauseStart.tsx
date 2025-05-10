import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

interface PauseStartProps {
  isRunning: boolean;
  timeLeft: number;
  setEndTime: Dispatch<SetStateAction<number | null>>;
  setIsRunning: Dispatch<SetStateAction<boolean>>;
  endTime: number | null;
  setTimeLeft: Dispatch<SetStateAction<number>>;
  activeType: string;
}

const PauseStart = ({ isRunning, timeLeft, setEndTime, setIsRunning, endTime, setTimeLeft, activeType }: PauseStartProps) => {
  const handleStart = () => {
    const newEndTime = Date.now() + timeLeft * 1000;
    setEndTime(newEndTime);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (endTime) {
      const remaining = Math.round((endTime - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
    }
    setEndTime(null);
  };
  return !isRunning ? (
    <Button
      onClick={handleStart}
      className={clsx("w-full", {
        "bg-blue-500 hover:bg-blue-600": activeType === "break" || activeType === "long_break",
        "bg-red-500 hover:bg-red-600": activeType === "focus",
      })}
      size="lg"
    >
      Start
    </Button>
  ) : (
    <Button
      onClick={handlePause}
      className={clsx("w-full", {
        "bg-blue-500 hover:bg-blue-600": activeType === "break" || activeType === "long_break",
        "bg-red-500 hover:bg-red-600": activeType === "focus",
      })}
      size="lg"
      variant="outline"
    >
      Pause
    </Button>
  );
};
export default PauseStart;
