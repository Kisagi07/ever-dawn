"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import BreadCrumb from "../components/BreadCrumb";
import { toast } from "../components/Toast";
import clsx from "clsx";
import updateStar from "../libs/updateStar";
import { useSearchParams } from "next/navigation";
import playSound from "@/utils/playSound";
import formatTime from "@/utils/formatTime";
import SkipSession from "@/components/pages/sol-cycle/SkipSession";
import { Button } from "@/components/ui/button";
import getDailyTarget from "@/lib/getDailyTarget";
import { Badge } from "@/components/ui/badge";
import updateTodayTotalFocus from "@/lib/updateTodayTotalFocus";
import getTodayTotalFocus from "@/lib/getTodayTotalFocus";
import Settings from "@/components/pages/sol-cycle/Settings";
import StarSelection from "@/components/pages/sol-cycle/StarSelection";

const SolCycle = () => {
  const searchParams = useSearchParams();

  const [scheme, setScheme] = useState<SetScheme | IteratingExtended[]>({
    break: 5,
    focus: 25,
  });
  const [activeType, setActiveType] = useState("focus");
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [starSelected, setStarSelected] = useState<Star | null>(null);
  const [dailyTarget, setDailyTarget] = useState("0");
  const [todayTotalFocus, setTodayTotalFocus] = useState(0);
  const [activeSchemeIndex, setActiveSchemeIndex] = useState(0);

  const starSelectedPrevious = useRef<Star | null>(null);

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
            body: text ? text : activeType === "focus" ? "Take a break!" : "Back to work!",
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
    const arrayScheme = scheme as IteratingExtended[];
    const nextIndex = activeSchemeIndex + 1;
    const completedSession = arrayScheme[activeSchemeIndex];
    const nextSession: IteratingExtended | undefined = arrayScheme[nextIndex];

    setActiveSchemeIndex(nextIndex);
    return { completedSession, nextSession };
  }, [scheme, activeSchemeIndex]);

  const switchDefaultScheme = useCallback(
    (type: "break" | "focus") => {
      setActiveType(type);
      setTimeLeft((scheme as SetScheme)[type] * 60);
      newEndTime((scheme as SetScheme)[type]);
    },
    [scheme]
  );

  const addTodayTotalFocus = useCallback(
    async (minute: number) => {
      const newTotal = todayTotalFocus + minute;
      setTodayTotalFocus(newTotal);
      const response = await updateTodayTotalFocus(newTotal);
      if (response === "FAIL") {
        toast("Failed in updating today total focus", "red");
      }
    },
    [todayTotalFocus]
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
            addTodayTotalFocus(scheme.focus);
          }
        } else {
          switchDefaultScheme("focus");
        }
      } else {
        const { completedSession, nextSession } = getTheNextIterateScheme();

        if (completedSession && completedSession.type === "focus" && !skipStarAdd) {
          addMinuteToStar(completedSession.time);
          addTodayTotalFocus(completedSession.time);
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
    [activeType, addMinuteToStar, getTheNextIterateScheme, scheme, sendNotification, stopPomodoro, switchDefaultScheme, addTodayTotalFocus]
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
      if (scheme.length > 0) {
        setTimeLeft(scheme[activeSchemeIndex].time * 60);
        setActiveType(scheme[activeSchemeIndex].type);
      } else {
        setTimeLeft(0);
      }
    }
    setEndTime(null);
  };

  const usingCustomScheme = () => Array.isArray(scheme);

  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    const customScheme = searchParams.get("scheme");
    if (customScheme) {
      const parsedScheme = JSON.parse(customScheme) as {
        focus: number;
        break: number;
        id: string;
      }[];
      const generatedScheme: IteratingExtended[] = [];
      parsedScheme.forEach((scheme) => {
        generatedScheme.push({
          type: "focus",
          time: scheme.focus,
          id: scheme.id + "focus",
        });
        generatedScheme.push({
          type: "break",
          time: scheme.break,
          id: scheme.id + "break",
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
  }, [isRunning, endTime, activeType, addMinuteToStar, noSchemeRemaining, scheme, sendNotification, handleSchemeCompletion]);

  useEffect(() => {
    getDailyTarget().then((response) => {
      if (typeof response === "object") {
        if ((response.message = "faile")) {
          toast("Failed to get daily target", "red");
        }
      } else {
        setDailyTarget(response.toString());
      }
    });
    getTodayTotalFocus().then((response) => {
      if (response === "FAIL") {
        toast("Failed to get today total focus", "red");
      } else if (response) {
        setTodayTotalFocus(response);
      }
    });
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="bg-white max-w-full p-6 rounded-lg shadow-lg flex items-center justify-center flex-col gap-4">
        <div className="w-full flex items-center justify-between">
          <BreadCrumb />
          <Settings dailyTarget={dailyTarget} setDailyTarget={setDailyTarget} />
        </div>
        <StarSelection setStarSelected={setStarSelected} starSelected={starSelected} />
        <div className="flex flex-col items-center gap-2 w-full">
          {Number(dailyTarget) > 0 && (
            <Badge
              variant="outline"
              className={clsx({
                "border-emerald-500 text-emerald-500": todayTotalFocus >= Number(dailyTarget),
              })}
            >
              {todayTotalFocus} / {dailyTarget}
            </Badge>
          )}
          {usingCustomScheme() && (
            <div className="overflow-hidden  w-full">
              <div className="flex gap-1 transition-transform delay-500" style={{ transform: `translateX(-${72 * activeSchemeIndex}px)` }}>
                {(scheme as IteratingExtended[]).map((sc, index) => (
                  <Badge
                    key={sc.id}
                    className={clsx("capitalize transition-all w-17 text-center", {
                      "bg-blue-100 text-blue-500": sc.type === "break",
                      "bg-red-100 text-red-500": sc.type === "focus",
                      "bg-blue-500 text-white": sc.type === "break" && index == activeSchemeIndex,
                      "bg-red-500 text-white": sc.type === "focus" && index == activeSchemeIndex,
                      "animate-fade-out": index < activeSchemeIndex,
                    })}
                  >
                    {sc.type} : {sc.time}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
        <h2
          className={clsx("text-7xl transition-colors font-bold font-jetbrains-mono", {
            "text-blue-500": activeType === "break",
            "text-red-500": activeType === "focus",
          })}
        >
          {formatTime(timeLeft)}
        </h2>
        {!isRunning ? (
          <Button
            onClick={handleStart}
            className={clsx("w-full text-white", {
              "bg-blue-500 hover:bg-blue-600": activeType === "break",
              "bg-red-500 hover:bg-red-600": activeType === "focus",
            })}
            size="lg"
          >
            Start
          </Button>
        ) : (
          <Button
            onClick={handlePause}
            className={clsx("w-full text-white", {
              "bg-blue-500 hover:bg-blue-600": activeType === "break",
              "bg-red-500 hover:bg-red-600": activeType === "focus",
            })}
            size="lg"
            variant="outline"
          >
            Pause
          </Button>
        )}
        <Button
          onClick={handleReset}
          className={clsx("w-full", {
            "border-blue-500 text-blue-500 hover:text-blue-600 hover:bg-blue-50": activeType === "break",
            "border-red-500 text-red-500 hover:text-red-600 hover:bg-red-50": activeType === "focus",
          })}
          size="lg"
          variant="outline"
        >
          Reset
        </Button>
        <SkipSession activeType={activeType} handleSchemeCompletion={handleSchemeCompletion} isRunning={isRunning} />
      </div>
    </div>
  );
};
export default SolCycle;
