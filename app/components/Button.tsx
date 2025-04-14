"use client";
import { ReactNode } from "react";

const Button = ({
  type = "button",
  children,
}: {
  type?: "button" | "submit";
  children: ReactNode;
}) => {
  return (
    <button
      type={type}
      className="relative overflow-hidden rounded-lg p-2 font-medium font-inter bg-red-100 text-red-600 cursor-pointer after:content-[''] after:absolute after:left-0 after:top-0 after:w-full after:h-full after:bg-red-950 after:transition-opacity after:opacity-0 hover:after:opacity-[0.08] focus:after:opacity-[0.1] active:after:opacity-[0.16]"
    >
      {children}
    </button>
  );
};

export default Button;
