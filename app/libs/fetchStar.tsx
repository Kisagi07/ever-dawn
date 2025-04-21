"use server";

import redis from "../upstash";

const fetchStar = async (): Promise<Star[]> => {
  const stars = await redis.get<Star[]>("stars");
  if (stars) {
    return stars;
  } else {
    return [];
  }
};
export default fetchStar;
