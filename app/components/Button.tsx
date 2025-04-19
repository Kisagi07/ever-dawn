"use client";
import { ReactNode } from "react";

const Button = ({
  type = "button",
  children,
  className = "",
  onClick,
}: {
  type?: "button" | "submit";
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) => {
  return (
    <button
      onClick={onClick}
      type={type}
      className={`relative overflow-hidden flex justify-center items-center gap-4 rounded-lg py-2 px-3 font-medium font-inter bg-red-100 text-red-600 cursor-pointer after:content-[''] after:absolute after:left-0 after:top-0 after:w-full after:h-full after:bg-red-950 after:transition-opacity after:opacity-0 hover:after:opacity-[0.08] focus:after:opacity-[0.1] active:after:opacity-[0.16] ${className}`}
    >
      {children}
    </button>
  );
};

export default Button;
