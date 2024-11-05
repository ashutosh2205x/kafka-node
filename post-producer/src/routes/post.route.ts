import { Router, Request, Response } from "express";
import { z } from "zod";
import postSchema from "../models/post.model";
import kafkaConfig from "../config/kafka.config";
import { v4 as uuid } from "uuid";
import { RedisConfig } from "../config/redis.config";
import PostModel, { Post } from "../../../post-consumer/src/models/post.model";

const postRouter = Router();
const redis = new RedisConfig();
postRouter.post("/create-post", async (req: Request, res: Response) => {
  try {
    const valid = postSchema.parse(req.body);
    const { title, body } = req.body;
    const pid = uuid();
    console.log("body", req.body);

    await kafkaConfig.sentToTopic("post", JSON.stringify({ pid, title, body }));
    await redis.set({ title, body, pid });
    res.status(200).json({ message: "success" });
  } catch (error) {
    console.log("create-post-error", error);
    res.status(403).json({ error });
  }
});

postRouter.get("/post/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    if (!id) {
      res.status(403).json({ message: "id is required" });
    }
    const post = redis.get(id);
    if (post && Object.keys(post).length > 0) {
      res.json({ post });
    }
    const postDb: Post | null = await PostModel.findOne({ pid: id });

    if (!postDb) {
      res.json({ message: "post not found..." });
    }
    await redis.set(postDb!);
    res.json({ post: postDb });
  } catch (error) {
    console.log("error while getting post", error);
    res.status(403).json({ error });
  }
});

export default postRouter;
