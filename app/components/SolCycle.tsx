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
import updateTodayTotalFocus from "@/lib/updateTodayTotalFocus";
import getTodayTotalFocus from "@/lib/getTodayTotalFocus";
import Settings from "@/components/pages/sol-cycle/Settings";

import BadgeAndManualAddMinute from "@/components/pages/sol-cycle/BadgeAndManualAddMinute";
import Time from "../classes/Time";
import calculateRythmScheme from "@/utils/calculateRythmScheme";
import getTodayRemainingTodayGoal from "@/lib/getTodayRemainingTodayGoal";
import PauseStart from "@/components/pages/sol-cycle/PauseStart";

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
  const [starSelected, setStarSelected] = useState<Star | null>(null);
  const [dailyTarget, setDailyTarget] = useState("0");
  const [todayTotalFocus, setTodayTotalFocus] = useState(0);

  const recalculateOnNextSwitch = useRef(false);

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

  const padTime = (time: number) => {
    return time.toString().padStart(2, "0");
  };

  const getTheNextIterateScheme = useCallback(async () => {
    let newScheme = [...(scheme as IteratingScheme[])];
    const completedSession = newScheme.shift();

    if (recalculateOnNextSwitch.current) {
      const type = searchParams.get("type") as "percentage" | "today goal";
      let endTime: string | Time = searchParams.get("end-time") as string;
      endTime = new Time(endTime);
      const now = new Date();
      const currentTime = new Time(`${padTime(now.getHours())}:${padTime(now.getMinutes())}:${padTime(now.getSeconds())}`);
      const maxFocus = searchParams.get("max-focus") as string;

      const options: { percentage?: number; todayGoal?: number } = {};
      if (type === "percentage") {
        const percentage = searchParams.get("percentage-value") as string;
        options.percentage = +percentage;
      } else {
        const leftOverGoal = await getTodayRemainingTodayGoal();
        if (typeof leftOverGoal === "number") {
          options.todayGoal = leftOverGoal;
        }
      }

      const recalculatedScheme = calculateRythmScheme(currentTime, endTime, type, +maxFocus, options);
      const parsedScheme = transformScheme(recalculatedScheme);
      newScheme = parsedScheme;
      recalculateOnNextSwitch.current = false;
    }
    const nextSession = newScheme[0];
    setScheme(newScheme);
    return { completedSession, nextSession };
  }, [scheme]);

  const switchDefaultScheme = useCallback(
    (type: "break" | "focus") => {
      setActiveType(type);
      setTimeLeft((scheme as SetScheme)[type] * 60);
      newEndTime((scheme as SetScheme)[type]);
    },
    [scheme]
  );

  const callUpdateTotalFocus = async (newTotal: number) => {
    const response = await updateTodayTotalFocus(newTotal);
    if (response === "FAIL") {
      toast("Failed in updating today total focus", "red");
    }
  };

  const addTodayTotalFocus = useCallback(
    async (minute: number) => {
      const newTotal = todayTotalFocus + minute;
      setTodayTotalFocus(newTotal);
      await callUpdateTotalFocus(newTotal);
    },
    [todayTotalFocus]
  );

  const handleSchemeCompletion = useCallback(
    async (skipStarAdd: boolean = false) => {
      sendNotification();
      playSound();
      if (!Array.isArray(scheme)) {
        if (activeType === "focus") {
          switchDefaultScheme("break");
          if (skipStarAdd) {
            addMinuteToStar(scheme.focus);
          }
          addTodayTotalFocus(scheme.focus);
        } else {
          switchDefaultScheme("focus");
        }
      } else {
        const { completedSession, nextSession } = await getTheNextIterateScheme();
        // remove the first element from the array
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
        setTimeLeft(scheme[0].time * 60);
        setActiveType(scheme[0].type);
      } else {
        setTimeLeft(0);
      }
    }
    setEndTime(null);
  };

  const transformScheme = (schemeToBeParsed: { focus?: number; break: number; id: string }[] | string) => {
    let parsedScheme;
    if (typeof schemeToBeParsed === "string") {
      parsedScheme = JSON.parse(schemeToBeParsed) as { focus: number; break: number; id: string }[];
    } else {
      parsedScheme = schemeToBeParsed;
    }
    const generatedScheme: IteratingScheme[] = [];
    parsedScheme.forEach((scheme) => {
      if (scheme.focus) {
        generatedScheme.push({
          type: "focus",
          time: scheme.focus,
        });
      }
      generatedScheme.push({
        type: "break",
        time: scheme.break,
      });
    });

    return generatedScheme;
  };
  useEffect(() => {
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
    const customScheme = searchParams.get("scheme");
    if (customScheme) {
      // const parsedScheme = JSON.parse(customScheme) as {
      //   focus: number;
      //   break: number;
      // }[];
      // const generatedScheme: IteratingScheme[] = [];
      // parsedScheme.forEach((scheme) => {
      //   generatedScheme.push({
      //     type: "focus",
      //     time: scheme.focus,
      //   });
      //   generatedScheme.push({
      //     type: "break",
      //     time: scheme.break,
      //   });
      // });
      const generatedScheme = transformScheme(customScheme);
      setScheme(generatedScheme);
      setTimeLeft(generatedScheme[0].time * 60);
      setActiveType(generatedScheme[0].type);
      newEndTime(generatedScheme[0].time);
      console.log(generatedScheme);
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
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg flex items-center justify-center flex-col gap-4">
          <div className="w-full flex items-center justify-between">
            <BreadCrumb />
            <Settings dailyTarget={dailyTarget} setDailyTarget={setDailyTarget} />
          </div>
          <BadgeAndManualAddMinute
            dailyTarget={Number(dailyTarget)}
            callUpdateTotalFocus={callUpdateTotalFocus}
            todayTotalFocus={todayTotalFocus}
            setTodayTotalFocus={setTodayTotalFocus}
          />
          <h2
            className={clsx("text-7xl transition-colors font-bold font-jetbrains-mono", {
              "text-blue-500": activeType === "break",
              "text-red-500": activeType === "focus",
            })}
          >
            {formatTime(timeLeft)}
          </h2>
          <PauseStart
            activeType={activeType}
            endTime={endTime}
            isRunning={isRunning}
            setEndTime={setEndTime}
            setIsRunning={setIsRunning}
            setTimeLeft={setTimeLeft}
            timeLeft={timeLeft}
          />
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
    </>
  );
};
export default SolCycle;
