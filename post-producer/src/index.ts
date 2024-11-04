import express, { Request, Response } from "express";
import { init } from "./config/start.services";
import ip from "ip";
import postRouter from "./routes/post.route";

const app = express();
app.use(express.json())
init();
app.get("/", async (rq: Request, rs: Response) => {
  rs.json({ status: "ok" });
});
app.use(postRouter)
app.listen(3000, () => {
  console.log("listening to 3000");
  console.log("ip=>", ip.address());
});
