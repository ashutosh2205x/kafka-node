import { Router, Request, Response } from "express";
import { z } from "zod";
import postSchema from "../models/post.model";
import kafkaConfig from "../config/kafka.config";

const postRouter = Router();

postRouter.post("/create-post", async (req: Request, res: Response) => {
  try {
    const valid = postSchema.parse(req.body);
    const { title, body } = req.body;
    console.log('body',req.body);
    await kafkaConfig.sentToTopic("post", JSON.stringify({ title, body }));
    res.status(200).json({ message:"success" });
  } catch (error) {
    console.log('create-post-error',error)
    res.status(403).json({ error });
  }
});

export default postRouter