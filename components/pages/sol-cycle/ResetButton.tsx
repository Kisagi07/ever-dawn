import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Dispatch, SetStateAction } from "react";

interface ResetButtonProps {
  setIsRunning: Dispatch<SetStateAction<boolean>>;
  setTimeLeft: Dispatch<SetStateAction<number>>;
  activeType: string;
  scheme: { type: "default" | "generated"; scheme: IteratingScheme[] };
  setActiveType: Dispatch<SetStateAction<"break" | "long_break" | "focus">>;
  setEndTime: Dispatch<SetStateAction<number | null>>;
  activeSchemeIndex: number;
}

const ResetButton = ({ setIsRunning, setTimeLeft, activeType, scheme, setActiveType, setEndTime, activeSchemeIndex }: ResetButtonProps) => {
  const handleReset = () => {
    setIsRunning(false);

    if (scheme.type === "default") {
      const resetTo = scheme.scheme[activeSchemeIndex];
      setTimeLeft(resetTo.time);
      setActiveType(resetTo.type);
    } else {
      if (scheme.scheme.length > 0) {
        setTimeLeft(scheme.scheme[0].time);
        setActiveType(scheme.scheme[0].type);
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
