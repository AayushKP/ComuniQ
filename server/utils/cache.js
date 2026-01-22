//Cache helper functions
import redis from "../config/redis.js";
const USER_TTL = 1800;
const ONLINE_PREFIX = "online:";
const USER_PREFIX = "user:";

//USER SESSION CACHE
export const getCachedUser = async (userId) => {
  try {
    const cached = await redis.get(`${USER_PREFIX}${userId}`);
    return cached || null;
  } catch (error) {
    console.error("Cache get error:", error.message);
    return null;
  }
};

export const setCachedUser = async (userId, userData) => {
  try {
    await redis.setex(
      `${USER_PREFIX}${userId}`,
      USER_TTL,
      JSON.stringify(userData),
    );
  } catch (error) {
    console.error("Cache set error:", error.message);
  }
};

export const deleteCachedUser = async (userId) => {
  try {
    await redis.del(`${USER_PREFIX}${userId}`);
  } catch (error) {
    console.log("Cache delete error", error);
  }
};

//ONLINE_PRESENCE

export const setUserOnline = async (userId, socketId) => {
  try {
    await redis.set(`${ONLINE_PREFIX}${userId}`, socketId);
  } catch (error) {
    console.error("Set online error:", error.message);
  }
};

export const setUserOffline = async (userId) => {
  try {
    await redis.del(`${ONLINE_PREFIX}${userId}`);
  } catch (error) {
    console.error("Set offline error:", error.message);
  }
};

export const getUserSocketId = async (userId) => {
  try {
    return await redis.get(`${ONLINE_PREFIX}${userId}`);
  } catch (error) {
    console.error("Get socket error:", error.message);
    return null;
  }
};

export const isUserOnline = async (userId) => {
  try {
    const socketId = await redis.get(`${ONLINE_PREFIX}${userId}`);
    return socketId !== null;
  } catch (error) {
    console.error("Check online error:", error.message);
    return false;
  }
};
