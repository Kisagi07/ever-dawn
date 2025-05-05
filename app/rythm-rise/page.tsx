"use client";
import { ChangeEvent, FocusEvent, KeyboardEvent, useEffect, useRef, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import TimeInput from "@/app/components/TimeInput";
import Time from "@/app/classes/Time";
import { toast } from "../components/Toast";
import BreadCrumb from "../components/BreadCrumb";
import Link from "next/link";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import getTodayRemainingTodayGoal from "@/lib/getTodayRemainingTodayGoal";
import clsx from "clsx";

const Page = () => {
  const [generatedSessions, setGeneratedSessions] = useState<{ focus: number; break: number; id: string }[]>([]);
  const [focusTarget, setFocusTarget] = useState<"percentage" | "today goal">("percentage");
  const [focusPercentage, setFocusPercentage] = useState("");
  const [todayGoal, setTodayGoal] = useState("");
  const [failedTodayGoalFetch, setFailedTodayGoalFetch] = useState(false);

  const perncetageOldValue = useRef<number | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Handle form submission logic here
    // #region value getter
    const formData = new FormData(e.currentTarget);
    let focusTotal = 0;

    const maxFocus = +(formData.get("max-focus") as string).replace(" Max Minutes", "").trim();
    let hourStart: Time;
    let hourEnd: Time;
    // #endregion

    // #region validate valid values
    try {
      hourStart = new Time(formData.get("hourStart") as string);
    } catch (error) {
      toast("Invalid hour start values", "red");
      console.error(error);
      return;
    }

    try {
      hourEnd = new Time(formData.get("hourEnd") as string);
    } catch (error) {
      console.error(error);
      toast("Invalid hour end values", "red");
      return;
    }

    if (!maxFocus) {
      toast("Max Focus Needed", "red");
    }

    // #endregion

    // #region calculate pomodoro scheme
    const difference = hourStart.getDifference(hourEnd);

    const totalFreeTime = difference.hours * 60 + difference.minutes;

    if (focusTarget === "percentage") {
      const focusPercentage = (focusTotal = +(formData.get("focus-percentage") as string).replace(" %", "").trim());
      focusTotal = (totalFreeTime * focusPercentage) / 100;
    } else {
      focusTotal = +todayGoal.replace(" Minutes", "");
    }

    if (!focusTotal) {
      toast("Focus Target are required", "red");
    }

    // const totalLearnTime = (totalFreeTime * learnPercentage) / 100;
    const totalSessions = Math.floor(focusTotal / maxFocus);
    const remainingTime = focusTotal % maxFocus;
    const sessionChunks = Array.from({ length: totalSessions }, () => {
      return maxFocus;
    });
    if (remainingTime > 0) {
      sessionChunks.push(remainingTime);
    }
    const remainingFreeTime = totalFreeTime - focusTotal;
    const breakTime = remainingFreeTime / sessionChunks.length;
    let breakCarry = 0;
    const sessionWithBreaks = sessionChunks
      .map((chunk) => {
        const decimal = breakTime - Math.floor(breakTime);
        breakCarry += decimal;
        const bonus = Math.floor(breakCarry / 1);
        if (bonus > 0) {
          breakCarry = breakCarry % 1;
        }
        return {
          focus: chunk,
          break: Math.floor(breakTime) + bonus,
          id: uuidv4(),
        };
      })
      .flat();
    setGeneratedSessions(sessionWithBreaks);
    // #endregion
  };
  // #region percentage input
  const handlePercentageBlur = (e: FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;
    if (value.length > 0) {
      const newValue = `${value} %`;
      input.value = newValue;
    }
  };
  const handlePercentageKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;

    if (key.length === 1 && isNaN(Number(key))) {
      e.preventDefault();
    }
  };
  const handlePercentageFocus = (e: FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;
    const newValue = value.replace(" %", "");
    input.value = newValue;
  };
  const handlePercentageChange = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (Number(value) > 100) {
      setFocusPercentage(perncetageOldValue.current ? perncetageOldValue.current.toString() : "");
    } else {
      perncetageOldValue.current = Number(value);
      setFocusPercentage(value);
    }
  };
  // #endregion
  // #region percentage input
  const handleMaxMinutesBlur = (e: FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;
    if (value.length > 0) {
      const newValue = `${value} Max Minutes`;
      input.value = newValue;
    }
  };
  const handleMaxMinutesKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    const { key } = e;

    if (key.length === 1 && isNaN(Number(key))) {
      e.preventDefault();
    }
  };
  const handleMaxMinutesFocus = (e: FocusEvent<HTMLInputElement>) => {
    const input = e.target;
    const value = input.value;
    const newValue = value.replace(" Max Minutes", "");
    input.value = newValue;
  };
  // #endregion

  useEffect(() => {
    if (focusTarget === "today goal" && !todayGoal) {
      setTodayGoal("Loading...");
      getTodayRemainingTodayGoal().then((res) => {
        if (typeof res === "number") {
          setTodayGoal(`${res} Minutes`);
          setFailedTodayGoalFetch(false);
        } else {
          setTodayGoal("Error");
          setFailedTodayGoalFetch(true);
          toast(res, "red");
        }
      });
    }
    if (focusTarget === "percentage" && failedTodayGoalFetch) {
      setFailedTodayGoalFetch(false);
      setTodayGoal("");
    }
  }, [focusTarget]);

  return (
    <div className="py-8">
      <div className="bg-white shadow rounded space-y-8 p-4 py-8 md:p-8 max-w-7xl mx-auto">
        <BreadCrumb />
        <h2 className="font-cormorant font-semibold text-3xl">Rythm Rise</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 bg-inherit sm:grid-cols-2 md:grid-cols-4">
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="focus-percentage">Focus Target</Label>
              <div className="flex gap-2">
                <Select value={focusTarget} onValueChange={(value) => setFocusTarget(value as typeof focusTarget)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Percentage" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage</SelectItem>
                    <SelectItem value="today goal">Today Goal</SelectItem>
                  </SelectContent>
                </Select>
                {focusTarget === "percentage" ? (
                  <Input
                    inputMode="tel"
                    placeholder="30%"
                    id="focus-percentage"
                    name="focus-percentage"
                    onBlur={handlePercentageBlur}
                    onFocus={handlePercentageFocus}
                    max={100}
                    onKeyDown={handlePercentageKeyDown}
                    onChange={handlePercentageChange}
                    value={focusPercentage}
                  />
                ) : (
                  <Input
                    value={todayGoal}
                    className={clsx({
                      "bg-red-100 border-red-500": failedTodayGoalFetch,
                    })}
                  />
                )}
              </div>
            </div>
            <TimeInput label="Jam Mulai" name="hourStart" />
            <TimeInput label="Jam Selesai" name="hourEnd" />
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="max-focus">Max Minutes</Label>

              <Input
                inputMode="tel"
                placeholder="15 Minutes"
                id="max-focus"
                onFocus={handleMaxMinutesFocus}
                onKeyDown={handleMaxMinutesKeyDown}
                onBlur={handleMaxMinutesBlur}
                name="max-focus"
              />
            </div>
          </div>
          <Button type="submit">Calculate</Button>
        </form>
        {generatedSessions.length > 0 && (
          <>
            <div className="flex flex-col gap-2">
              <h3 className="font-cormorant font-medium text-2xl">Generated Sessions</h3>
              <ul className="flex flex-wrap gap-2">
                {generatedSessions.map((session) => (
                  <Session break={session.break} focus={session.focus} key={session.id} />
                ))}
              </ul>
            </div>
            <Button asChild>
              <Link href={`/sol-cycle?scheme=${JSON.stringify(generatedSessions)}`}>
                Open Scheme in Sol Cycle
                <ArrowRightCircleIcon className="size-6 group-hover:translate-x-4 transition-transform" />
              </Link>
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
export default Page;

function Session({ focus, break: breakTime }: { focus: number; break: number }) {
  return (
    <>
      <li className=" font-medium bg-blue-100 text-blue-600 p-2 rounded-md">{focus}</li>
      <li className=" font-medium bg-emerald-100 text-emerald-600 p-2 rounded-md">{breakTime}</li>
    </>
  );
}
