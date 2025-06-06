import StarSelect from "@/app/components/StarSelect";
import Tooltip from "@/app/components/Tooltip";
import { Button } from "@/components/ui/button";
import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";
import { X } from "lucide-react";

interface StarSelectionProps {
  starSelected: Star | null;
  setStarSelected: Dispatch<SetStateAction<Star | null>>;
}

const StarSelection = ({ starSelected, setStarSelected }: StarSelectionProps) => {
  const [openStarSelect, setOpenStarSelect] = useState(false);

  return (
    <div className="relative" data-testid="star-selection">
      <div className="flex items-center gap-2 ml-8">
        <Tooltip text="Change Active Star">
          <button onClick={() => setOpenStarSelect(!openStarSelect)} className={clsx("font-medium transition-colors cursor-pointer")}>
            {starSelected ? starSelected.name : "Select Star"}
          </button>
        </Tooltip>
        <Button className="size-6" size="icon" variant="outline" onClick={() => setStarSelected(null)}>
          <X />
        </Button>
      </div>
      {openStarSelect && (
        <StarSelect
          starSelected={(star) => {
            setStarSelected(star);
            setOpenStarSelect(false);
          }}
        />
      )}
    </div>
  );
};
export default StarSelection;
