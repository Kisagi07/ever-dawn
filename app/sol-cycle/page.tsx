"use client";

import { useState } from "react";
import BreadCrumb from "../components/BreadCrumb";

const Page = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return;
  };

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
  };

  return (
    <div className="bg-white w-full h-screen flex items-center justify-center flex-col gap-4">
      <BreadCrumb />
      <p className=" text-primary font-medium">Drawing</p>
      <h2 className="text-7xl font-bold text-primary">25:00</h2>
      {!isRunning ? (
        <button
          onClick={handleStart}
          className="bg-primary text-white font-semibold text-2xl px-4 py-2 relative rounded-lg min-w-60 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:opacity-0 after:rounded-[inherit] after:transition-opacity hover:after:opacity-hover active:after:opacity-active focus:after:opacity-focus cursor-pointer"
        >
          Start
        </button>
      ) : (
        <button
          onClick={handlePause}
          className="bg-secondary text-white font-semibold text-2xl px-4 py-2 relative rounded-lg min-w-60 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:opacity-0 after:rounded-[inherit] after:transition-opacity hover:after:opacity-hover active:after:opacity-active focus:after:opacity-focus cursor-pointer"
        >
          Pause
        </button>
      )}
      <button
        onClick={handleReset}
        className="bg-white text-primary border border-primary font-semibold text-2xl px-4 py-2 relative rounded-lg min-w-60 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-red-600 after:opacity-0 after:rounded-[inherit] after:transition-opacity hover:after:opacity-hover active:after:opacity-active focus:after:opacity-focus cursor-pointer"
      >
        Reset
      </button>
      <h3 className="text-xl font-medium text-neutral-400">Focus</h3>
    </div>
  );
};
export default Page;
