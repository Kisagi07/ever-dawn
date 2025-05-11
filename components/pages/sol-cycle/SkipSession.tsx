import Tooltip from "@/app/components/Tooltip";
import capitalizeWords from "@/app/utilities/capitalizeWords";
import { Button } from "@/components/ui/button";

interface SkipSessionProps {
  activeType: string;
  isRunning: boolean;
  handleSchemeCompletion: (bool: boolean) => void;
}

const SkipSession = ({ activeType, isRunning, handleSchemeCompletion }: SkipSessionProps) => {
  return (
    <Tooltip text={`Switch to ${activeType === "focus" ? "break" : "focus"}`}>
      <Button disabled={isRunning} onClick={() => handleSchemeCompletion(true)} variant="outline">
        {capitalizeWords(activeType.replace("_", " "))}
      </Button>
    </Tooltip>
  );
};
export default SkipSession;
