"use server";

import redis from "@/app/upstash";

const getDailyTarget = async () => {
  try {
    const response = await redis.get<number>("daily-target");
    if (response) {
      return response;
    } else {
      return 0;
    }
  } catch (err) {
    console.error(err);
    return { message: "failed" };
  }
};
export default getDailyTarget;
