"use client";
import { ReactNode, MouseEvent, useState } from "react";

const Button = ({
  type = "button",
  children,
}: {
  type?: "button" | "submit";
  children: ReactNode;
}) => {
  const [ripples, setRipples] = useState<{ x: number; y: number }[]>([]);

  const onClick = (e: MouseEvent<HTMLButtonElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left - 10;
    const y = e.clientY - rect.top - 10;

    setRipples((prev) => [...prev, { x, y }]);

    // Remove the ripple after animation ends
    setTimeout(() => {
      setRipples((prev) => prev.slice(1));
    }, 600);
  };

  return (
    <button
      onClick={onClick}
      type={type}
      className="relative overflow-hidden rounded-lg p-2 font-medium font-inter bg-primary-fixed-dim text-on-primary-fixed cursor-pointer after:content-[''] after:absolute after:left-0 after:top-0 after:w-full after:h-full after:bg-on-primary-container/0 after:transition-colors hover:after:bg-on-primary-container/[0.1]"
    >
      {ripples.map((ripple, index) => (
        <span
          key={index}
          className="absolute bg-on-primary-container/[0.16] rounded-full animate-ripple"
          style={{
            left: ripple.x,
            top: ripple.y,
            transform: "translate(-50%, -50%)",
            width: "20px",
            height: "20px",
          }}
        />
      ))}
      {children}
    </button>
  );
};

export default Button;
