import { ContextMenu, ContextMenuItem, ContextMenuTrigger, ContextMenuContent } from "@/components/ui/context-menu";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import handleKeydownOnlyNumber from "@/lib/handleKeydownOnlyNumber";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/button";

interface BadgeAndManualAddMinuteProps {
  dailyTarget: number;
  todayTotalFocus: number;
  callUpdateTotalFocus: (newTotal: number) => Promise<void>;
}

const BadgeAndManualAddMinute = ({ dailyTarget, todayTotalFocus, callUpdateTotalFocus }: BadgeAndManualAddMinuteProps) => {
  const [manualAddMinute, setManualAddMinute] = useState("0");
  const [manuallyAddingMinute, setManuallyAddingMinute] = useState(false);
  const [openManuallyAddMinuteDialog, setOpenManuallyAddMinuteDialog] = useState(false);

  const handleAddManualMinute = async () => {
    const newTotal = todayTotalFocus + +manualAddMinute;
    setManuallyAddingMinute(true);
    await callUpdateTotalFocus(newTotal);
    setManuallyAddingMinute(false);
    setOpenManuallyAddMinuteDialog(false);
  };

  return (
    <>
      {dailyTarget > 0 && (
        <Dialog open={openManuallyAddMinuteDialog} onOpenChange={setOpenManuallyAddMinuteDialog}>
          <ContextMenu>
            <ContextMenuTrigger asChild>
              <Badge
                variant="outline"
                className={clsx({
                  "border-emerald-500 text-emerald-500": todayTotalFocus >= Number(dailyTarget),
                })}
              >
                {todayTotalFocus} / {dailyTarget}
              </Badge>
            </ContextMenuTrigger>
            <ContextMenuContent>
              <DialogTrigger asChild>
                <ContextMenuItem>Add Minutes</ContextMenuItem>
              </DialogTrigger>
            </ContextMenuContent>
          </ContextMenu>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Minute Manually to Total Focus</DialogTitle>
              <DialogDescription>This action cannot be undone. This will permanently add focus minute to today total</DialogDescription>
            </DialogHeader>
            <Input
              placeholder="Minute"
              value={manualAddMinute}
              onChange={(e) => setManualAddMinute(e.target.value)}
              onKeyDown={handleKeydownOnlyNumber}
            />
            <DialogFooter>
              <Button disabled={manuallyAddingMinute} onClick={handleAddManualMinute}>
                {manuallyAddingMinute && <Loader2 className="animate-spin" />}
                Submit
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
};

export default BadgeAndManualAddMinute;
