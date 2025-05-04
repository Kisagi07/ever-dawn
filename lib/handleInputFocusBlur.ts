import { FocusEvent } from "react";

export const handleBlurIndicator = (e: FocusEvent<HTMLInputElement>, indicator: string) => {
  const input = e.target;
  const value = input.value;
  if (value.length > 0) {
    const newValue = `${value}${indicator}`;
    input.value = newValue;
  }
};
export const handleFocusIndicator = (e: FocusEvent<HTMLInputElement>, indicator: string) => {
  const input = e.target;
  const value = input.value;
  const newValue = value.replace(indicator, "");
  input.value = newValue;
};
