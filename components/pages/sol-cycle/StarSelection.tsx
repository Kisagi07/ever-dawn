import StarSelect from "@/app/components/StarSelect";
import Tooltip from "@/app/components/Tooltip";
import clsx from "clsx";
import { Dispatch, SetStateAction, useState } from "react";

interface StarSelectionProps {
  starSelected: Star | null;
  setStarSelected: Dispatch<SetStateAction<Star | null>>;
}

const StarSelection = ({ starSelected, setStarSelected }: StarSelectionProps) => {
  const [openStarSelect, setOpenStarSelect] = useState(false);

  return (
    <div className="relative" data-testid="star-selection">
      <Tooltip text="Change Active Star">
        <button onClick={() => setOpenStarSelect(!openStarSelect)} className={clsx("font-medium transition-colors cursor-pointer")}>
          {starSelected ? starSelected.name : "Select Star"}
        </button>
      </Tooltip>
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
