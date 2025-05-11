import { toast } from "@/app/components/Toast";
import { Button } from "@/components/ui/button";
import { DialogContent, Dialog, DialogTrigger, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { handleBlurIndicator, handleFocusIndicator } from "@/lib/handleInputFocusBlur";
import handleKeydownOnlyNumber from "@/lib/handleKeydownOnlyNumber";
import updateDailyTarget from "@/lib/updateDailyTarget";
import { Settings as SettingsIcon } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface SettingsProps {
  dailyTarget: string;
  setDailyTarget: Dispatch<SetStateAction<string>>;
  playSoundVolume: number[];
  setPlaySoundVolume: Dispatch<SetStateAction<number[]>>;
}

const Settings = ({ dailyTarget, setDailyTarget, setPlaySoundVolume, playSoundVolume }: SettingsProps) => {
  const handleSettingSave = async () => {
    const result = await updateDailyTarget(Number(dailyTarget));
    if (result.status !== "success") {
      toast("Daily target failed to update", "red");
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="ghost">
          <SettingsIcon />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>Sol Cycle Settings</DialogDescription>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="grid w-full items-center gap-2">
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
          <div className="grid w-full items-center gap-2">
            <Label>Volume : {playSoundVolume[0] * 100}</Label>
            <Slider min={0.01} max={1} step={0.01} value={playSoundVolume} onValueChange={setPlaySoundVolume} />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleSettingSave} className="mt-4 bg-red-500 text-white hover:bg-red-600">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
export default Settings;
