//Cache helper functions
import redis from "../config/redis.js";
const USER_TTL = 1800;
const ONLINE_PREFIX = "online:";
const USER_PREFIX = "user:";
const SOCKET_PREFIX = "socket:";

// In-memory fallbacks for single-instance deployments when Redis fails
const localOnlineMap = new Map();
const localSocketMap = new Map();

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
  // Always update in-memory fallback first
  const oldSocketIdLocal = localOnlineMap.get(userId);
  if (oldSocketIdLocal) {
    localSocketMap.delete(oldSocketIdLocal);
  }
  localOnlineMap.set(userId, socketId);
  localSocketMap.set(socketId, userId);

  try {
    // Clean up old socket mapping if user was already online
    const oldSocketId = await redis.get(`${ONLINE_PREFIX}${userId}`);
    if (oldSocketId) {
      await redis.del(`${SOCKET_PREFIX}${oldSocketId}`);
    }

    //set both mappings to avoid changing things in frontend
    await redis.set(`${ONLINE_PREFIX}${userId}`, socketId);
    await redis.set(`${SOCKET_PREFIX}${socketId}`, userId);
  } catch (error) {
    console.error("Set online error:", error.message);
  }
};

export const setUserOffline = async (socketId) => {
  // Update in-memory fallback
  const userIdLocal = localSocketMap.get(socketId);
  if (userIdLocal) {
    localOnlineMap.delete(userIdLocal);
  }
  localSocketMap.delete(socketId);

  try {
    const userId = await redis.get(`${SOCKET_PREFIX}${socketId}`);
    if (userId) {
      await redis.del(`${ONLINE_PREFIX}${userId}`);
    }
    await redis.del(`${SOCKET_PREFIX}${socketId}`);
  } catch (error) {
    console.error("Set offline error:", error.message);
  }
};

export const getUserSocketId = async (userId) => {
  // Check local memory FIRST (0ms latency)
  const localId = localOnlineMap.get(userId);
  if (localId) return localId;

  // Fallback to Redis (HTTP call latency)
  try {
    const redisSocketId = await redis.get(`${ONLINE_PREFIX}${userId}`);
    if (redisSocketId) return redisSocketId;
  } catch (error) {
    console.error("Get socket error:", error.message);
  }
  return null;
};

export const isUserOnline = async (userId) => {
  // Check local memory FIRST (0ms latency)
  if (localOnlineMap.has(userId)) return true;

  try {
    const socketId = await redis.get(`${ONLINE_PREFIX}${userId}`);
    if (socketId) return true;
  } catch (error) {
    console.error("Check online error:", error.message);
  }
  return false;
};
