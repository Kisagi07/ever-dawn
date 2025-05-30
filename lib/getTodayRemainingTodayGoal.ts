"use server";

import getDailyTarget from "@/lib/getDailyTarget";
import getTodayTotalFocus from "@/lib/getTodayTotalFocus";

const getTodayRemainingTodayGoal = async ({locale,timeZone}: {locale:string, timeZone:string}) => {
  try {
    const target = await getDailyTarget();
    let todayTotalFocus = await getTodayTotalFocus(timeZone, locale);

    if (target === 0) {
      return "You don't have daily target set";
    }

    if (todayTotalFocus === "FAIL") {
      return "Failed to get today total focus";
    }

    if (todayTotalFocus == null) todayTotalFocus = 0;

    if (typeof target === "number" && typeof todayTotalFocus === "number") {
      const remaining = target - Math.floor(todayTotalFocus / 60);
      return remaining;
    } else {
      return "Failed to get today total focus";
    }
  } catch (error) {
    console.error(error);
    return "Something wrong getting remainng today focus";
  }
};
export default getTodayRemainingTodayGoal;
