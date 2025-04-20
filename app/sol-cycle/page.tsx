"use client";

import { useEffect, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import { toast } from "../components/Toast";
import { send } from "process";

const Page = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  useEffect(() => {
    let timer: NodeJS.Timeout;
    let endTime: number;

    if (isRunning) {
      endTime = Date.now() + timeLeft * 1000;

      timer = setInterval(() => {
        const newTimeLeft = Math.round((endTime - Date.now()) / 1000);

        if (newTimeLeft <= 0) {
          setTimeLeft(0);
          setIsRunning(false);
          // toast("Time's up!", "blue");
          sendNotification();

          clearInterval(timer);
        } else {
          setTimeLeft(newTimeLeft);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [isRunning]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const sendNotification = () => {
    if (Notification.permission === "granted") {
      new Notification("Time's up!", {
        body: "Your timer has finished.",
      });
    } else {
      toast("Please allow notification in your browser settings.", "blue");
    }
  };

  const handleReset = () => {
    setIsRunning(false);
    setTimeLeft(25 * 60);
  };

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  }, []);

  return (
    <div className="bg-white w-full h-screen flex items-center justify-center flex-col gap-4">
      <BreadCrumb />
      <p className=" text-primary font-medium">Drawing</p>
      <h2 className="text-7xl font-bold text-primary">
        {formatTime(timeLeft)}
      </h2>
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
