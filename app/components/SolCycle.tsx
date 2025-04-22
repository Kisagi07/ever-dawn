"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import { toast } from "../components/Toast";
import Tooltip from "../components/Tooltip";
import clsx from "clsx";
import StarSelect from "../components/StarSelect";
import updateStar from "../libs/updateStar";
import { useSearchParams } from "next/navigation";

interface SetScheme {
  break: number;
  focus: number;
}

interface IteratingScheme {
  type: "focus" | "break";
  time: number;
}

const SolCycle = () => {
  const searchParams = useSearchParams();

  const [scheme, setScheme] = useState<SetScheme | IteratingScheme[]>({
    break: 5,
    focus: 25,
  });
  const [activeType, setActiveType] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [openStarSelect, setOpenStarSelect] = useState(false);
  const [starSelected, setStarSelected] = useState<Star | null>(null);

  const starSelectedPrevious = useRef<Star | null>(null);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(
      2,
      "0"
    )}`;
  };

  const newEndTime = (minute: number) => {
    const newEndTime = Date.now() + minute * 60 * 1000;
    setEndTime(newEndTime);
  };

  const addMinuteToStar = useCallback(
    (minute: number) => {
      if (starSelected) {
        const newStar = { ...starSelected };
        newStar.spentMinutes += minute;
        setStarSelected(newStar);
        updateStar(newStar);
      }
    },
    [starSelected]
  );

  const sendNotification = useCallback(
    (text?: string) => {
      if (document.visibilityState === "visible") {
        toast("Time's up!", "blue");
        return;
      } else {
        if (Notification.permission === "granted") {
          new Notification("Time's up!", {
            body: text
              ? text
              : activeType === "focus"
              ? "Take a break!"
              : "Back to work!",
            icon: "/notification-icon.png",
          });
        } else {
          toast("Please allow notification in your browser settings.", "blue");
        }
      }
    },
    [activeType]
  );

  const noSchemeRemaining = useCallback(() => {
    sendNotification("Good Job! You have done your sol session.");
  }, [sendNotification]);

  const stopPomodoro = useCallback(() => {
    noSchemeRemaining();
    setIsRunning(false);
    setEndTime(null);
  }, [noSchemeRemaining]);

  const getTheNextIterateScheme = useCallback(() => {
    const newScheme = [...(scheme as IteratingScheme[])];
    const completedSession = newScheme.shift();
    const nextSession = newScheme[0];
    setScheme(newScheme);
    return { completedSession, nextSession };
  }, [scheme]);

  const playSound = () => {
    const audio = new Audio("/sounds/ene-goshujin.mp3");
    audio.volume = 0.2;
    audio.play();
  };

  const switchDefaultScheme = useCallback(
    (type: "break" | "focus") => {
      setActiveType(type);
      setTimeLeft((scheme as SetScheme)[type] * 60);
      newEndTime((scheme as SetScheme)[type]);
    },
    [scheme]
  );

  const handleSchemeCompletion = useCallback(
    (skipStarAdd: boolean = false) => {
      sendNotification();
      playSound();
      if (!Array.isArray(scheme)) {
        if (activeType === "focus") {
          switchDefaultScheme("break");
          if (skipStarAdd) {
            addMinuteToStar(scheme.focus);
          }
        } else {
          switchDefaultScheme("focus");
        }
      } else {
        const { completedSession, nextSession } = getTheNextIterateScheme();
        // remove the first element from the array
        if (
          completedSession &&
          completedSession.type === "focus" &&
          !skipStarAdd
        ) {
          addMinuteToStar(completedSession.time);
        }
        if (nextSession) {
          setActiveType(nextSession.type);
          setTimeLeft(nextSession.time * 60);
          newEndTime(nextSession.time);
        } else {
          stopPomodoro();
        }
      }
    },
    [
      activeType,
      addMinuteToStar,
      getTheNextIterateScheme,
      scheme,
      sendNotification,
      stopPomodoro,
      switchDefaultScheme,
    ]
  );

  const handleStart = () => {
    const newEndTime = Date.now() + timeLeft * 1000;
    setEndTime(newEndTime);
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
    if (endTime) {
      const remaining = Math.round((endTime - Date.now()) / 1000);
      setTimeLeft(remaining > 0 ? remaining : 0);
    }
    setEndTime(null);
  };

  const handleReset = () => {
    setIsRunning(false);
    if (!Array.isArray(scheme)) {
      switch (activeType) {
        case "focus":
          setTimeLeft(scheme.focus * 60);
          break;
        case "break":
          setTimeLeft(scheme.break * 60);
          break;
      }
    } else {
      setTimeLeft(scheme[0].time * 60);
      setActiveType(scheme[0].type);
    }
    setEndTime(null);
  };

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    const customScheme = searchParams.get("scheme");
    if (customScheme) {
      const parsedScheme = JSON.parse(customScheme) as {
        focus: number;
        break: number;
      }[];
      const generatedScheme: IteratingScheme[] = [];
      parsedScheme.forEach((scheme) => {
        generatedScheme.push({
          type: "focus",
          time: scheme.focus,
        });
        generatedScheme.push({
          type: "break",
          time: scheme.break,
        });
      });
      setScheme(generatedScheme);
      setTimeLeft(generatedScheme[0].time * 60);
      setActiveType(generatedScheme[0].type);
      newEndTime(generatedScheme[0].time);
    }
  }, [searchParams]);

  useEffect(() => {
    document.title = `Ever Dawn - ${formatTime(timeLeft)}`;
  }, [timeLeft]);

  useEffect(() => {
    if (starSelected) {
      if (starSelectedPrevious.current) {
        updateStar(starSelected);
      } else {
        starSelectedPrevious.current = starSelected;
      }
    }
  }, [starSelected]);

  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isRunning && endTime) {
      timer = setInterval(() => {
        const newTimeLeft = Math.round((endTime - Date.now()) / 1000);

        if (newTimeLeft <= 0) {
          clearInterval(timer);
          handleSchemeCompletion();
        } else {
          setTimeLeft(newTimeLeft);
        }
      }, 1000);
    }

    return () => clearInterval(timer);
  }, [
    isRunning,
    endTime,
    activeType,
    addMinuteToStar,
    noSchemeRemaining,
    scheme,
    sendNotification,
    handleSchemeCompletion,
  ]);

  return (
    <div className="bg-white w-full h-screen flex items-center justify-center flex-col gap-4">
      <BreadCrumb />
      <div className="relative">
        <Tooltip text="Change Active Star">
          <button
            onClick={() => setOpenStarSelect(!openStarSelect)}
            className={clsx("font-medium transition-colors cursor-pointer")}
          >
            {starSelected ? starSelected.name : "Select Star"}
          </button>
        </Tooltip>
        {openStarSelect && (
          <StarSelect
            starSelected={(star) => {
              setStarSelected(star);
              setOpenStarSelect(false);
            }}
          />
        )}
      </div>
      <h2
        className={clsx(
          "text-7xl transition-colors font-bold font-jetbrains-mono",
          {
            "text-secondary": activeType === "break",
            "text-primary": activeType === "focus",
          }
        )}
      >
        {formatTime(timeLeft)}
      </h2>
      {!isRunning ? (
        <button
          onClick={handleStart}
          className={clsx(
            " text-white transition-colors font-semibold text-2xl px-4 py-2 relative rounded-lg min-w-60 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:opacity-0 after:rounded-[inherit] after:transition-opacity hover:after:opacity-hover active:after:opacity-active focus:after:opacity-focus cursor-pointer",
            {
              "bg-secondary": activeType === "break",
              "bg-primary": activeType === "focus",
            }
          )}
        >
          Start
        </button>
      ) : (
        <button
          onClick={handlePause}
          className={clsx(
            "text-white transition-colors font-semibold text-2xl px-4 py-2 relative rounded-lg min-w-60 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full after:bg-black after:opacity-0 after:rounded-[inherit] after:transition-opacity hover:after:opacity-hover active:after:opacity-active focus:after:opacity-focus cursor-pointer",
            {
              "bg-secondary": activeType === "break",
              "bg-primary": activeType === "focus",
            }
          )}
        >
          Pause
        </button>
      )}
      <button
        onClick={handleReset}
        className={clsx(
          "bg-white transition-colors border font-semibold text-2xl px-4 py-2 relative rounded-lg min-w-60 after:content-[''] after:absolute after:top-0 after:left-0 after:w-full after:h-full  after:opacity-0 after:rounded-[inherit] after:transition-opacity hover:after:opacity-hover active:after:opacity-active focus:after:opacity-focus cursor-pointer",
          {
            "border-secondary text-secondary after:bg-secondary":
              activeType === "break",
            "border-primary text-primary after:bg-primary":
              activeType === "focus",
          }
        )}
      >
        Reset
      </button>
      <Tooltip text={`Switch to ${activeType === "focus" ? "break" : "focus"}`}>
        <button
          disabled={isRunning}
          onClick={() => handleSchemeCompletion(true)}
          className="text-xl cursor-pointer hover:text-black transition-colors font-medium text-neutral-400 capitalize"
        >
          {activeType}
        </button>
      </Tooltip>
    </div>
  );
};
export default SolCycle;
