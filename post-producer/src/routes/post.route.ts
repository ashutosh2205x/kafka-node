import { Router, Request, Response } from "express";
import { z } from "zod";
import postSchema from "../models/post.model";

const postRouter = Router();

postRouter.post("/create-post", async (req: Request, res: Response) => {
    const valid = postSchema.parse(req.body);
    try {
        const {title, body} = req.body
        res.json({})
    } catch (error) {
        
    }

});
