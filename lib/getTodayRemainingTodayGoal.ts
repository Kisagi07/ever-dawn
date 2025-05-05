"use server";

import getDailyTarget from "./getDailyTarget";
import getTodayTotalFocus from "./getTodayTotalFocus";

const getTodayRemainingTodayGoal = async () => {
  try {
    const target = await getDailyTarget();
    let todayTotalFocus = await getTodayTotalFocus();

    if (target === 0) {
      return "You don't have daily target set";
    }

    if (todayTotalFocus === "FAIL") {
      return "Failed to get today total focus";
    }

    if (todayTotalFocus == null) todayTotalFocus = 0;

    if (typeof target === "number" && typeof todayTotalFocus === "number") {
      const remaining = target - todayTotalFocus;
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
