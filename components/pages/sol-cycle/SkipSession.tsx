import Tooltip from "@/app/components/Tooltip";

interface SkipSessionProps {
  activeType: string;
  isRunning: boolean;
  handleSchemeCompletion: (bool: boolean) => void;
}

const SkipSession = ({
  activeType,
  isRunning,
  handleSchemeCompletion,
}: SkipSessionProps) => {
  return (
    <Tooltip text={`Switch to ${activeType === "focus" ? "break" : "focus"}`}>
      <button
        disabled={isRunning}
        onClick={() => handleSchemeCompletion(true)}
        className="text-xl cursor-pointer hover:text-black transition-colors font-medium text-neutral-400 capitalize"
      >
        {activeType}
      </button>
    </Tooltip>
  );
};
export default SkipSession;
