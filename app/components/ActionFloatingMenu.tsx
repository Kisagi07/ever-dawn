import {
  ArrowsRightLeftIcon,
  ClockIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import clsx from "clsx";
import { MouseEvent, ReactNode, useRef, useState } from "react";
import Tooltip from "./Tooltip";

interface ActionFloatingMenuProps {
  children: ReactNode;
  addTimeOnClick: () => void;
  onSpentMinuteCorrectionClick: () => void;
  onDeleteClick: () => void;
}
const ActionFloatingMenu = ({
  children,
  addTimeOnClick,
  onSpentMinuteCorrectionClick,
  onDeleteClick,
}: ActionFloatingMenuProps) => {
  const [position, setPosition] = useState({ left: 0, top: 0 });

  const containerRef = useRef<HTMLDivElement>(null);

  const handleClicked = (e: MouseEvent<HTMLDivElement>) => {
    const handleAutoClose = () => {
      setPosition({ left: 0, top: 0 });
      document.removeEventListener("click", handleAutoClose);
    };

    if (position.left > 0 || position.top > 0) {
      setPosition({ left: 0, top: 0 });
      document.removeEventListener("click", handleAutoClose);
    } else {
      const { clientX, clientY } = e;
      const rect = e.currentTarget.getBoundingClientRect();
      const x = clientX - rect.left - 20;
      const y = clientY - rect.top - 20;
      setPosition({ top: y, left: x });

      document.addEventListener("click", handleAutoClose);
    }
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClicked}
      className={clsx("cursor-pointer relative", {
        "after:content-[''] after:absolute  after:top-0 after:left-0 after:w-full after:h-full after:pointer-none after:bg-black after:rounded-[inherit] rounded-lg after:opacity-0 after:transition-opacity hover:after:opacity-hover focus:after:opacity-focus active:after:opacity-active":
          position.left === 0 && position.top === 0,
      })}
    >
      <div
        className="absolute"
        style={{
          display: position.left > 0 || position.top > 0 ? "block" : "none",
          left: position.left,
          top: position.top,
        }}
      >
        <div className="relative z-10">
          <div className="absolute -translate-y-full">
            <Tooltip text="Add Time Spent">
              <button
                onClick={addTimeOnClick}
                className="bg-white cursor-pointer rounded-full p-2 ring ring-neutral-300 shadow after:content-[''] after:absolute  after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:rounded-[inherit] after:opacity-0 after:transition-opacity hover:after:opacity-hover focus:after:opacity-focus active:after:opacity-active"
              >
                <ClockIcon className="size-6" />
              </button>
            </Tooltip>
          </div>
          <div className="absolute -translate-y-[calc(100%-20px)] translate-x-10">
            <Tooltip text="Spent Minute Correction">
              <button
                onClick={onSpentMinuteCorrectionClick}
                className="bg-white cursor-pointer rounded-full p-2 ring ring-neutral-300 shadow after:content-[''] after:absolute  after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:rounded-[inherit] after:opacity-0 after:transition-opacity hover:after:opacity-hover focus:after:opacity-focus active:after:opacity-active"
              >
                <ArrowsRightLeftIcon className="size-6" />
              </button>
            </Tooltip>
          </div>
          <div className="absolute -translate-y-[calc(100%-60px)] translate-x-15">
            <Tooltip text="Delete Star">
              <button
                onClick={onDeleteClick}
                className="bg-rose-500 cursor-pointer text-white rounded-full p-2 ring ring-rose-300 shadow after:content-[''] after:absolute  after:top-0 after:left-0 after:w-full after:h-full after:bg-rose-950 after:rounded-[inherit] after:opacity-0 after:transition-opacity hover:after:opacity-hover focus:after:opacity-focus active:after:opacity-active"
              >
                <TrashIcon className="size-6" />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
};
export default ActionFloatingMenu;
