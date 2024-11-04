import express, { Request, Response } from "express";
import { init } from "./services/start.services";

const app = express();
app.use(express.json());
init();
app.get("/", async (rq: Request, rs: Response) => {
  rs.json({ status: "ok" });
});
app.listen(3001, () => {
  console.log("post consumer : listening to 3001");
});
