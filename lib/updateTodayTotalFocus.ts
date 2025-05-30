"use server";

import redis from "@/app/upstash";
import getTodayDateString from "@/utils/getTodayDateString";

const updateTodayTotalFocus = async (focus: number, {locale, timeZone}: {locale:string, timeZone:string}) => {
  try {
    // Get today date
    const dateString = getTodayDateString(timeZone, locale);

    // Find today total focus
    let daysFocus = await redis.get<DayFocus[]>("total-focus");
    if (daysFocus) {
      let today = daysFocus.find((day) => {
        return day.date === dateString;
      });

      if (today) {
        today.total = focus;
        const todayIndex = daysFocus.findIndex((day) => day.date === dateString);
        if (todayIndex !== -1) {
          daysFocus[todayIndex] = today;
        } else {
          throw Error("Failed to update today focus total");
        }
      } else {
        today = {
          date: dateString,
          total: focus,
        };

        daysFocus.push(today);
      }
    } else {
      daysFocus = [
        {
          date: dateString,
          total: focus,
        },
      ];
    }
    await redis.set("total-focus", daysFocus);
  } catch (err) {
    console.error(err);
    return "FAIL";
  }

  return "OK";
};
export default updateTodayTotalFocus;
