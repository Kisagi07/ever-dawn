import { toast } from "@/app/components/Toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { handleBlurIndicator, handleFocusIndicator } from "@/lib/handleInputFocusBlur";
import handleKeydownOnlyNumber from "@/lib/handleKeydownOnlyNumber";
import updateDailyTarget from "@/lib/updateDailyTarget";
import { Settings as SettingsIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface SettingsProps {
  dailyTarget: string;
  setDailyTarget: Dispatch<SetStateAction<string>>;
}

const Settings = ({ dailyTarget, setDailyTarget }: SettingsProps) => {
  const handleSettingSave = async () => {
    const result = await updateDailyTarget(Number(dailyTarget));
    if (result.status !== "success") {
      toast("Daily target failed to update", "red");
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <SettingsIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent>
        <h3>Settings</h3>
        <Separator className="my-4" />
        <div className="grid w-full items-center gap-1.5">
          <Label htmlFor="daily-target">Daily Target</Label>
          <Input
            id="daily-target"
            placeholder="Daily Focus Target"
            value={dailyTarget}
            onChange={(e) => setDailyTarget(e.target.value)}
            onKeyDown={handleKeydownOnlyNumber}
            onFocus={(e) => handleFocusIndicator(e, " Minutes")}
            onBlur={(e) => handleBlurIndicator(e, " Minutes")}
          />
        </div>
        <Button onClick={handleSettingSave} className="mt-4 bg-red-500 text-white hover:bg-red-600">
          Save
        </Button>
      </PopoverContent>
    </Popover>
  );
};
export default Settings;
