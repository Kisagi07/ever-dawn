"use server";

import redis from "../upstash";
import fetchStar from "./fetchStar";

const updateStar = async (star: Star) => {
  const stars = await fetchStar();
  const updatedStars = stars.map((s) => {
    if (s.name === star.name) {
      return { ...s, ...star };
    }
    return s;
  });
  await redis.set("stars", updatedStars);
  return "Your star glows brighter!";
};

export default updateStar;
