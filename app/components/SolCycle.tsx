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
import getDailyTarget from "@/lib/getDailyTarget";
import updateTodayTotalFocus from "@/lib/updateTodayTotalFocus";
import getTodayTotalFocus from "@/lib/getTodayTotalFocus";
import Settings from "@/components/pages/sol-cycle/Settings";
import BadgeAndManualAddMinute from "@/components/pages/sol-cycle/BadgeAndManualAddMinute";
import Time from "../classes/Time";
import calculateRythmScheme from "@/utils/calculateRythmScheme";
import getTodayRemainingTodayGoal from "@/lib/getTodayRemainingTodayGoal";
import PauseStart from "@/components/pages/sol-cycle/PauseStart";
import StarSelection from "@/components/pages/sol-cycle/StarSelection";
import ResetButton from "@/components/pages/sol-cycle/ResetButton";
import newEndTime from "@/utils/newEndTime";
import addSecondsToStar from "@/utils/addSecondsToStar";
import padTime from "@/utils/padTime";
import sendNotification from "@/utils/sendNotification";
import getLocale from "../utilities/getLocale";

const SolCycle = () => {
  const searchParams = useSearchParams();

  const [scheme, setScheme] = useState<{ type: "default" | "generated"; scheme: IteratingScheme[] }>({
    type: "default",
    scheme: [
      { type: "focus", time: 25 * 60 },
      { type: "break", time: 5 * 60 },
      { type: "focus", time: 25 * 60 },
      { type: "break", time: 5 * 60 },
      { type: "focus", time: 25 * 60 },
      { type: "break", time: 5 * 60 },
      { type: "focus", time: 25 * 60 },
      { type: "long_break", time: 15 * 60 },
    ],
  });
  const [activeType, setActiveType] = useState<"focus" | "break" | "long_break">("focus");
  const [timeLeft, setTimeLeft] = useState(scheme.scheme[0]?.time || 0);
  const [isRunning, setIsRunning] = useState(false);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [starSelected, setStarSelected] = useState<Star | null>(null);
  const [dailyTarget, setDailyTarget] = useState("0");
  const [todayTotalFocus, setTodayTotalFocus] = useState(0);
  const [playSoundVolume, setPlaySoundVolume] = useState([0.2]);

  const recalculateOnNextSwitch = useRef(false);
  const activeSchemeIndex = useRef(0);

  const starSelectedPrevious = useRef<Star | null>(null);

  const noSchemeRemaining = useCallback(() => {
    sendNotification(activeType, "Good Job! You have done your sol session.");
  }, [activeType]);

  const stopPomodoro = useCallback(() => {
    noSchemeRemaining();
    setIsRunning(false);
    setEndTime(null);
  }, [noSchemeRemaining]);

  const getTheNextIterateScheme = useCallback(async () => {
    if (scheme.type === "generated") {
      let newScheme = [...scheme.scheme];
      const completedSession = newScheme.shift();
      if (recalculateOnNextSwitch.current) {
        // Get passed parameter
        const type = searchParams.get("type") as "percentage" | "today goal";
        let endTime: string | Time = searchParams.get("end-time") as string;
        endTime = new Time(endTime);
        const now = new Date();
        const currentTime = new Time(`${padTime(now.getHours())}:${padTime(now.getMinutes())}:${padTime(now.getSeconds())}`);
        const maxFocus = searchParams.get("max-focus") as string;

        const options: { percentage?: number; todayGoal?: number; startWithBreak?: boolean } = {};
        // Check if recalculation start with break or not
        if (completedSession && completedSession.type === "focus") {
          options.startWithBreak = true;
        }
        // get how much percentage or today goal left for calculation
        if (type === "percentage") {
          const percentage = searchParams.get("percentage-value") as string;
          options.percentage = +percentage;
        } else {
          let leftOverGoal = (await getTodayRemainingTodayGoal(getLocale())) as number;
          if (typeof leftOverGoal === "number") {
            if (completedSession!.type === "focus") {
              leftOverGoal -= completedSession!.time / 60;
            }
            options.todayGoal = leftOverGoal;
          }
        }

        // calculate and transform
        const recalculatedScheme = calculateRythmScheme(currentTime, endTime, type, +maxFocus, options);
        const parsedScheme = transformScheme(recalculatedScheme);
        newScheme = parsedScheme;
        // reset
        recalculateOnNextSwitch.current = false;
      }
      const nextSession = newScheme[0];
      setScheme({ type: "generated", scheme: newScheme });
      return { completedSession, nextSession };
    } else {
      const nextIndex = activeSchemeIndex.current === scheme.scheme.length - 1 ? 0 : activeSchemeIndex.current + 1;
      const nextSession = scheme.scheme[nextIndex];
      const completedSession = scheme.scheme[activeSchemeIndex.current];

      activeSchemeIndex.current = nextIndex;

      return { nextSession, completedSession };
    }
  }, [scheme, searchParams]);

  const callUpdateTotalFocus = async (newTotal: number) => {
    const response = await updateTodayTotalFocus(newTotal, getLocale());
    if (response === "FAIL") {
      toast("Failed in updating today total focus", "red");
    }
  };

  const addTodayTotalFocus = useCallback(
    async (seconds: number) => {
      const newTotal = todayTotalFocus + seconds;
      setTodayTotalFocus(newTotal);
      await callUpdateTotalFocus(newTotal);
    },
    [todayTotalFocus]
  );

  const handleSchemeCompletion = useCallback(
    async (skip: boolean = false) => {
      playSound({ volume: playSoundVolume[0] });
      const { completedSession, nextSession } = await getTheNextIterateScheme();
      if (completedSession) {
        sendNotification(activeType);
      }

      if (completedSession && completedSession.type === "focus" && !skip) {
        addSecondsToStar(completedSession.time, starSelected, setStarSelected);
        addTodayTotalFocus(completedSession.time);
      } else if (completedSession && completedSession.type === "focus") {
        const passedSeconds = Math.abs(completedSession.time - timeLeft);
        addSecondsToStar(passedSeconds, starSelected, setStarSelected);
        addTodayTotalFocus(passedSeconds);
      }

      if (nextSession) {
        setActiveType(nextSession.type);
        setTimeLeft(nextSession.time);
        newEndTime(nextSession.time, setEndTime);
      } else {
        stopPomodoro();
      }
    },
    [getTheNextIterateScheme, activeType, stopPomodoro, addTodayTotalFocus, playSoundVolume, starSelected, timeLeft]
  );

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
      const generatedScheme = transformScheme(customScheme);
      setScheme({ type: "generated", scheme: generatedScheme });
      setTimeLeft(generatedScheme[0].time);
      setActiveType(generatedScheme[0].type);
      newEndTime(generatedScheme[0].time, setEndTime);
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
  }, [isRunning, endTime, activeType, noSchemeRemaining, scheme, handleSchemeCompletion]);

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

    const {locale,timeZone} = getLocale()   

    getTodayTotalFocus(timeZone, locale).then((response) => {
      if (response === "FAIL") {
        toast("Failed to get today total focus", "red");
      } else if (response) {
        setTodayTotalFocus(response);
      }
    });
    const savedVolume = localStorage.getItem("audio-volume");
    if (savedVolume) {
      setPlaySoundVolume([+savedVolume]);
    } else {
      setPlaySoundVolume([0.2]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("audio-volume", playSoundVolume[0].toString());
  }, [playSoundVolume]);

  return (
    <>
      <div className="w-full h-screen flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-lg flex w-full max-w-sm items-center justify-center flex-col gap-4">
          <div className="w-full flex items-center justify-between">
            <BreadCrumb />
            <Settings
              dailyTarget={dailyTarget}
              setDailyTarget={setDailyTarget}
              playSoundVolume={playSoundVolume}
              setPlaySoundVolume={setPlaySoundVolume}
            />
          </div>
          <StarSelection starSelected={starSelected} setStarSelected={setStarSelected} />
          <BadgeAndManualAddMinute
            dailyTarget={Number(dailyTarget)}
            callUpdateTotalFocus={callUpdateTotalFocus}
            todayTotalFocus={todayTotalFocus}
            setTodayTotalFocus={setTodayTotalFocus}
          />
          <h2
            className={clsx("text-7xl transition-colors font-bold font-jetbrains-mono", {
              "text-blue-500": activeType === "break" || activeType === "long_break",
              "text-red-500": activeType === "focus",
            })}
          >
            {formatTime(timeLeft)}
          </h2>
          <PauseStart
            recalculateOnNextSwitch={recalculateOnNextSwitch}
            activeType={activeType}
            endTime={endTime}
            isRunning={isRunning}
            setEndTime={setEndTime}
            setIsRunning={setIsRunning}
            setTimeLeft={setTimeLeft}
            timeLeft={timeLeft}
          />
          <ResetButton
            activeType={activeType}
            scheme={scheme}
            setActiveType={setActiveType}
            setEndTime={setEndTime}
            setIsRunning={setIsRunning}
            setTimeLeft={setTimeLeft}
            activeSchemeIndex={activeSchemeIndex.current}
          />
          <SkipSession activeType={activeType} handleSchemeCompletion={handleSchemeCompletion} isRunning={isRunning} />
        </div>
      </div>
    </>
  );
};
export default SolCycle;
