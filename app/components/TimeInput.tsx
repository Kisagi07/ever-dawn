"use client";
import { useEffect, useRef, useState } from "react";

export default function TimeInput({
  label = "",
  name = "",
}: {
  label?: string;
  name?: string;
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

  useEffect(() => {
    if (focusOn) {
      const indicateFocus = () => {
        if (focusOn === "minutes") {
          minuteRef.current?.focus();
        } else if (focusOn === "seconds") {
          secondRef.current?.focus();
        } else if (focusOn === "hours") {
          hourRef.current?.focus();
        }
      };

      const handleClick = (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        if (target.tagName !== "SPAN") {
          setFocusOn(undefined);
        }
      };
      const determineHourValue = (value: string, prevValue: string) => {
        if (prevValue === "--") {
          return `-${value}`;
        } else if (prevValue.split("")[0] === "-") {
          const [_, second] = prevValue.split("");
          if (+second > 2 || (+second >= 2 && +value > 3)) {
            return `-${value}`;
          }
          return `${second}${value}`;
        } else {
          return `-${value}`;
        }
      };
      const determinaMinuteOrSecondValue = (
        value: string,
        prevValue: string
      ) => {
        if (prevValue === "--") {
          return `-${value}`;
        } else if (prevValue.split("")[0] === "-") {
          const [_, second] = prevValue.split("");
          if (+second >= 6 || (+second >= 6 && +value > 0)) {
            return `-${value}`;
          }
          return `${second}${value}`;
        } else {
          return `-${value}`;
        }
      };

      const handleKeyDown = (e: KeyboardEvent) => {
        const key = +e.key;
        if (isNaN(key)) return;
        if (focusOn === "hours") {
          setValues((prev) => {
            const newValue =
              determineHourValue(key.toString(), prev.hours) || key.toString();
            if (newValue.split("")[0] !== "-") {
              setFocusOn("minutes");
            }
            return {
              ...prev,
              hours: newValue,
            };
          });
        } else if (focusOn === "minutes") {
          setValues((prev) => {
            const newValue =
              determinaMinuteOrSecondValue(key.toString(), prev.minutes) ||
              key.toString();
            if (newValue.split("")[0] !== "-") {
              setFocusOn("seconds");
            }
            return {
              ...prev,
              minutes: newValue,
            };
          });
        } else if (focusOn === "seconds") {
          setValues((prev) => {
            const newValue =
              determinaMinuteOrSecondValue(key.toString(), prev.seconds) ||
              key.toString();

            if (newValue.split("")[0] !== "-") {
              setFocusOn(undefined);
            }
            return {
              ...prev,
              seconds: newValue,
            };
          });
        }
      };

      indicateFocus();
      document.addEventListener("click", handleClick);
      document.addEventListener("keydown", handleKeyDown);
      return () => {
        document.removeEventListener("click", handleClick);
        document.removeEventListener("keydown", handleKeyDown);
      };
    } else {
      minuteRef.current?.blur();
      secondRef.current?.blur();
      hourRef.current?.blur();
    }
  }, [focusOn]);

  return (
    <div
      className={`font-jetbrains-mono border  rounded flex transition-all items-center p-2 select-none relative bg-inherit ${
        focusOn ? "ring-1 ring-primary border-primary" : "border-accent"
      }`}
    >
      <input
        name={name}
        type="hidden"
        value={`${values.hours}:${values.minutes}:${values.seconds}`}
      />
      <span
        ref={hourRef}
        tabIndex={0}
        onClick={(e) => {
          e.currentTarget.focus();
          setFocusOn("hours");
        }}
        className="focus:bg-gray-500/20 px-1 rounded-lg focus:outline-none"
      >
        {values.hours}
      </span>
      <span>:</span>
      <span
        ref={minuteRef}
        tabIndex={0}
        onClick={(e) => {
          e.currentTarget.focus();
          setFocusOn("minutes");
        }}
        className="focus:bg-gray-500/20 px-1 rounded-lg focus:outline-none"
      >
        {values.minutes}
      </span>
      <span>:</span>
      <span
        ref={secondRef}
        tabIndex={0}
        onClick={(e) => {
          e.currentTarget.focus();
          setFocusOn("seconds");
        }}
        className="focus:bg-gray-500/20 px-1 rounded-lg focus:outline-none"
      >
        {values.seconds}
      </span>
      <label
        className={`font-inter text-sm font-medium absolute top-0 -translate-y-[10px] bg-inherit transition-colors px-1 ${
          focusOn && "text-primary"
        }`}
      >
        {label}
      </label>
    </div>
  );
}
