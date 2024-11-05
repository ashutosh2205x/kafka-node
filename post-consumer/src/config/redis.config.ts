import redis, { RedisClientType,createClient } from "redis";

interface Post {
  title: string;
  body: string;
  pid: string;
}

export class RedisConfig {
  public redis: RedisClientType;
  constructor() {
    if (this.redis) {
      console.log("redis already connected...");
      return;
    }
    try {
      this.redis = createClient();
      console.log("Consumer: Connected to Redis...");

    } catch (error) {
      throw new Error("error in redis connection...");
    }
  }
  async get(pid: string) {
    if (!this.redis) {
      console.log("redis not connected...");
      return null;
    }
    try {
      const data = await this.redis.get(pid);
      console.log("get data from redis...", data);
      return {
        pid: data,
      };
    } catch (error) {
      console.log("error in getting from redis...");
      throw new Error("error in saving into redis...");
    }
  }
}

export default new RedisConfig();
