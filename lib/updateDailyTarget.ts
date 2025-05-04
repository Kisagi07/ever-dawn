"use server";

import redis from "@/app/upstash";

const updateDailyTarget = async (target: number) => {
  try {
    const response = await redis.set("daily-target", target);
    if (response === "OK") {
      return { status: "success" };
    } else {
      throw Error("something wrong");
    }
  } catch (err) {
    console.error(err);
    return { status: "failed" };
  }
};

export default updateDailyTarget;
