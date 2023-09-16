import dotenv from "dotenv";
import express from "express";
import { fetchHello } from "./aws/lambda/util";
import { newsRoutes, stockRoutes } from "../src/routes";

const port = process.env.PORT || 3000;
const app = express();

dotenv.config();

app.get("/", (req, res) => res.send("hello"));

app.get("/testing", async (req, res) => {
  const result = fetchHello();
  return res.send(result);
});

app.use("/news", newsRoutes);

app.use("/stock", stockRoutes);

app.listen(port, () => {
  console.log(`Server running at PORT:${port}/`);
});
