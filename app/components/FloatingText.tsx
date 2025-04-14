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

  const hasValue = internalValue.length > 0;

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
    <div className="relative bg-white mt-3">
      <input
        id={name}
        name={name}
        onFocus={handleOnFocus}
        onBlur={handleOnBlur}
        ref={inputRef}
        value={internalValue}
        onChange={(e) => setInternalValue(e.target.value)}
        type="text"
        className="border w-full peer border-outline rounded p-2 transition-all focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary font-medium"
      />
      <label
        onClick={() => inputRef.current?.focus()}
        htmlFor=""
        className={` font-inter absolute left-4 top-1/2 -translate-y-1/2 block bg-inherit font-medium px-1 text-sm peer-focus:top-0 peer-focus:-translate-y-[10px] transition-all peer-focus:left-2 peer-focus:text-primary ${
          hasValue ? " !top-0 !-translate-y-[10px] !left-2" : ""
        }`}
      >
        {label}
      </label>
    </div>
  );
};
export default FloatingText;
