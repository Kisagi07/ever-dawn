"use client";
import { ChangeEvent, useRef, useState } from "react";

const FloatingText = ({
  label = "",
  defaultValue = "",
  endOfValue = "",
  name = "",
}: {
  label?: string;
  defaultValue?: string;
  endOfValue?: string;
  name?: string;
}) => {
  const [internalValue, setInternalValue] = useState(
    defaultValue + " " + endOfValue
  );
  const inputRef = useRef<HTMLInputElement>(null);

  const handleOnFocus = (e: ChangeEvent<HTMLInputElement>) => {
    // remove endof value from interval value
    const value = e.target.value.replace(endOfValue, "").trim();
    setInternalValue(value);
  };

  const handleOnBlur = () => {
    // add endof value to interval value
    const value = internalValue.replace(endOfValue, "").trim();
    setInternalValue(value + " " + endOfValue);
  };

  return (
    <div className="pt-3 text-sm">
      <div className="relative ">
        <input
          id={name}
          name={name}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          ref={inputRef}
          value={internalValue}
          onChange={(e) => setInternalValue(e.target.value)}
          type="text"
          className="border w-full peer border-outline rounded p-2 pt-5 pb-1 transition-all focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium"
        />
        <label
          onClick={() => inputRef.current?.focus()}
          htmlFor=""
          className={`text-slate-700 font-inter absolute top-0 block bg-inherit text-sm px-2 peer-focus:text-primary`}
        >
          {label}
        </label>
      </div>
    </div>
  );
};
export default FloatingText;
