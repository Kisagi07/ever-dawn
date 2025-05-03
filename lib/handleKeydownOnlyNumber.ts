import { KeyboardEvent } from "react";

const handleKeydownOnlyNumber = (e: KeyboardEvent<HTMLInputElement>) => {
  const { key } = e;

  if (key.length === 1 && isNaN(Number(key))) {
    e.preventDefault();
  }
};

export default handleKeydownOnlyNumber;
