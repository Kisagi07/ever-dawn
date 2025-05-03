"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import handleKeydownOnlyNumber from "@/lib/handleKeydownOnlyNumber";
import {
  ChangeEvent,
  FocusEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
} from "react";

export default function TimeInput({
  label = "",
  name = "",
  id = "",
}: {
  label?: string;
  name?: string;
  id?: string;
}) {
  const [values, setValues] = useState({
    hours: "--",
    minutes: "--",
    seconds: "--",
  });

  const [focusOn, setFocusOn] = useState<
    "hours" | "minutes" | "seconds" | undefined
  >();

  const hourRef = useRef<HTMLSpanElement>(null);
  const minuteRef = useRef<HTMLSpanElement>(null);
  const secondRef = useRef<HTMLSpanElement>(null);

  const previousTimeValue = useRef<string | null>(null);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const input = e.target;
    let value = input.value;

    const usePrevousValue = () => {
      input.value = previousTimeValue.current ? previousTimeValue.current : "";
      value = input.value;
    };

    if (value.length < 3) {
      const hourValue = Number(value.slice(0, 2));
      if (hourValue > 24) {
        usePrevousValue();
      }
    } else {
      const [minuteValue, secondValue] = value.slice(5).split(" : ");
      if (secondValue) {
        if (Number(secondValue) > 60) {
          usePrevousValue();
        }
      } else {
        if (Number(minuteValue) > 60) {
          usePrevousValue();
        }
      }
    }

    if (value.length === 2 || value.length === 7) {
      value = `${value} : `;
      input.value = value;
    } else if (value.length === 12) {
      input.blur();
    }

    previousTimeValue.current = value;
  };

  const handleFocus = (e: FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = "";
    input.value = value;
  };

  // useEffect(() => {
  //   if (focusOn) {
  //     const indicateFocus = () => {
  //       if (focusOn === "minutes") {
  //         minuteRef.current?.focus();
  //       } else if (focusOn === "seconds") {
  //         secondRef.current?.focus();
  //       } else if (focusOn === "hours") {
  //         hourRef.current?.focus();
  //       }
  //     };

  //     const handleClick = (e: MouseEvent) => {
  //       if (
  //         e.target !== hourRef.current &&
  //         e.target !== minuteRef.current &&
  //         e.target !== secondRef.current
  //       ) {
  //         setFocusOn(undefined);
  //       }
  //     };
  //     const determineHourValue = (value: string, prevValue: string) => {
  //       if (prevValue === "--") {
  //         return `-${value}`;
  //       } else if (prevValue.split("")[0] === "-") {
  //         const second = prevValue.split("")[1];
  //         if (+second > 2 || (+second >= 2 && +value > 3)) {
  //           return `-${value}`;
  //         }
  //         return `${second}${value}`;
  //       } else {
  //         return `-${value}`;
  //       }
  //     };
  //     const determinaMinuteOrSecondValue = (
  //       value: string,
  //       prevValue: string
  //     ) => {
  //       if (prevValue === "--") {
  //         return `-${value}`;
  //       } else if (prevValue.split("")[0] === "-") {
  //         const second = prevValue.split("")[1];
  //         if (+second >= 6 || (+second >= 6 && +value > 0)) {
  //           return `-${value}`;
  //         }
  //         return `${second}${value}`;
  //       } else {
  //         return `-${value}`;
  //       }
  //     };

  //     const handleKeyDown = (e: KeyboardEvent) => {
  //       const key = +e.key;
  //       if (isNaN(key)) return;
  //       if (focusOn === "hours") {
  //         setValues((prev) => {
  //           const newValue =
  //             determineHourValue(key.toString(), prev.hours) || key.toString();
  //           if (newValue.split("")[0] !== "-") {
  //             setFocusOn("minutes");
  //           }
  //           return {
  //             ...prev,
  //             hours: newValue,
  //           };
  //         });
  //       } else if (focusOn === "minutes") {
  //         setValues((prev) => {
  //           const newValue =
  //             determinaMinuteOrSecondValue(key.toString(), prev.minutes) ||
  //             key.toString();
  //           if (newValue.split("")[0] !== "-") {
  //             setFocusOn("seconds");
  //           }
  //           return {
  //             ...prev,
  //             minutes: newValue,
  //           };
  //         });
  //       } else if (focusOn === "seconds") {
  //         setValues((prev) => {
  //           const newValue =
  //             determinaMinuteOrSecondValue(key.toString(), prev.seconds) ||
  //             key.toString();

  //           if (newValue.split("")[0] !== "-") {
  //             setFocusOn(undefined);
  //           }
  //           return {
  //             ...prev,
  //             seconds: newValue,
  //           };
  //         });
  //       }
  //     };

  //     indicateFocus();
  //     document.addEventListener("click", handleClick);
  //     document.addEventListener("keydown", handleKeyDown);
  //     return () => {
  //       document.removeEventListener("click", handleClick);
  //       document.removeEventListener("keydown", handleKeyDown);
  //     };
  //   } else {
  //     minuteRef.current?.blur();
  //     secondRef.current?.blur();
  //     hourRef.current?.blur();
  //   }
  // }, [focusOn]);

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder="00 : 00 : 00"
        onKeyDown={handleKeydownOnlyNumber}
        name={name}
        onChange={handleChange}
        onFocus={handleFocus}
      />
    </div>
    // <div className="pt-3 text-sm">
    //   <div
    //     className={`font-jetbrains-mono border rounded flex transition-all items-center p-2 pb-1 pt-5 select-none relative bg-inherit ${
    //       focusOn ? "ring-1 ring-primary border-primary" : "border-accent"
    //     }`}
    //   >
    //     <input
    //       name={name}
    //       type="hidden"
    //       value={`${values.hours}:${values.minutes}:${values.seconds}`}
    //     />
    //     <span
    //       ref={hourRef}
    //       tabIndex={0}
    //       onClick={(e) => {
    //         e.currentTarget.focus();
    //         setFocusOn("hours");
    //       }}
    //       className="focus:bg-gray-500/20 px-1 rounded-lg focus:outline-none"
    //     >
    //       {values.hours}
    //     </span>
    //     <span>:</span>
    //     <span
    //       ref={minuteRef}
    //       tabIndex={0}
    //       onClick={(e) => {
    //         e.currentTarget.focus();
    //         setFocusOn("minutes");
    //       }}
    //       className="focus:bg-gray-500/20 px-1 rounded-lg focus:outline-none"
    //     >
    //       {values.minutes}
    //     </span>
    //     <span>:</span>
    //     <span
    //       ref={secondRef}
    //       tabIndex={0}
    //       onClick={(e) => {
    //         e.currentTarget.focus();
    //         setFocusOn("seconds");
    //       }}
    //       className="focus:bg-gray-500/20 px-1 rounded-lg focus:outline-none"
    //     >
    //       {values.seconds}
    //     </span>
    //     <label
    //       className={`font-inter text-sm font-medium text-gray-700 absolute top-0 bg-inherit transition-colors ${
    //         focusOn && "text-primary"
    //       }`}
    //     >
    //       {label}
    //     </label>
    //   </div>
    // </div>
  );
}
