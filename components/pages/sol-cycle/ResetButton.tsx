import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

interface ResetButtonProps {
  setIsRunning: Dispatch<SetStateAction<boolean>>;
  setTimeLeft: Dispatch<SetStateAction<number>>;
  activeType: string;
  scheme: SetScheme | IteratingScheme[];
  setActiveType: Dispatch<SetStateAction<string>>;
  setEndTime: Dispatch<SetStateAction<number | null>>;
}

const ResetButton = ({ setIsRunning, setTimeLeft, activeType, scheme, setActiveType, setEndTime }: ResetButtonProps) => {
  const handleReset = () => {
    setIsRunning(false);
    if (!Array.isArray(scheme)) {
      switch (activeType) {
        case "focus":
          setTimeLeft(scheme.focus * 60);
          break;
        case "break":
          setTimeLeft(scheme.break * 60);
          break;
      }
    } else {
      if (scheme.length > 0) {
        setTimeLeft(scheme[0].time);
        setActiveType(scheme[0].type);
      } else {
        setTimeLeft(0);
      }
    }
    setEndTime(null);
  };

  return (
    <Button
      onClick={handleReset}
      className={clsx("w-full", {
        "border-blue-500 text-blue-500 hover:text-blue-600 hover:bg-blue-50": activeType === "break",
        "border-red-500 text-red-500 hover:text-red-600 hover:bg-red-50": activeType === "focus",
      })}
      size="lg"
      variant="outline"
    >
      Reset
    </Button>
  );
};
export default ResetButton;
