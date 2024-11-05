import redis, { RedisClientType, createClient } from "redis";

interface Post {
  title: string;
  body: string;
  pid: string;
}

export class RedisConfig {
  public redis: any;
  constructor() {
    try {
      this.redis = createClient();
      console.log("Producer: Connected to Redis...");
    } catch (error) {
      console.log("error in redis connection...", error);
      throw new Error("error in redis connection...");
    }
    this.redis = createClient({});
  }
  async set(data: Post) {
    if (!this.redis) {
      console.log("redis not connected...");
      return null;
    }
    try {
      await this.redis.set(data.pid!, data.body);
      console.log("saved into redis...");
    } catch (error) {
      console.log("error in saving into redis...");
      throw new Error("error in saving into redis...");
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
      return { data };
    } catch (error) {
      console.log("error in getting from redis...");
      throw new Error("error in saving into redis...");
    }
  }
}

export default new RedisConfig();
