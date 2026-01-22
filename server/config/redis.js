import { Redis } from "@upstash/redis";

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_URL,
  token: process.env.UPSTASH_REDIS_TOKEN,
});

// Test connection
const testConnection = async () => {
  try {
    await redis.set("connection-test", "ok");
    const result = await redis.get("connection-test");
    if (result === "ok") {
      console.log("Redis connected successfully");
    }
  } catch (error) {
    console.error("Redis connection failed:", error.message);
  }
};

testConnection();

export default redis;
