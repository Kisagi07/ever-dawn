"use server";

import redis from "@/app/upstash";
import getTodayDateString from "@/utils/getTodayDateString";

const getTodayTotalFocus = async (timezone:string, locale:string) => {
  try {
    const response = await redis.get<DayFocus[]>("total-focus");
    if (response) {
      const todayDate = getTodayDateString(timezone, locale);
      const today = response.find((day) => day.date === todayDate);
      if (today) {
        return today.total;
      }
    }
    return null;
  } catch (err) {
    console.error(err);
    return "FAIL";
  }
};
export default getTodayTotalFocus;
