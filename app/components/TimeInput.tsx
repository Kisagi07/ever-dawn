"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import handleKeydownOnlyNumber from "@/lib/handleKeydownOnlyNumber";
import { ChangeEvent, FocusEvent, KeyboardEvent, useRef } from "react";

export default function TimeInput({
  label = "",
  name = "",
  id = "",
}: {
  label?: string;
  name?: string;
  id?: string;
}) {
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
      if (hourValue > 23) {
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

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    handleKeydownOnlyNumber(e);

    if (e.key === "ArrowLeft") {
      e.preventDefault();
      const input = e.currentTarget;
      const [hourValue, minuteValue, secondValue] =
        e.currentTarget.value.split(" : ");
      if (!minuteValue || minuteValue.length < 2) {
        const newValue = ``;
        input.value = newValue;
      } else {
        const newValue = `${hourValue} : `;
        input.value = newValue;
      }
    }
  };

  return (
    <div className="grid w-full items-center gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        placeholder="00 : 00 : 00"
        onKeyDown={handleKeyDown}
        name={name}
        onChange={handleChange}
        onFocus={handleFocus}
        inputMode="tel"
      />
    </div>
  );
}
