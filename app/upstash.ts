import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: "https://allowed-tuna-20630.upstash.io",
  token: "VCWAAIjcDE2YWFkZjg5MzcyNjQ0YjhlYjgxOWY2MzczNjA2NTRmNHAxMA",
});

export default redis;
