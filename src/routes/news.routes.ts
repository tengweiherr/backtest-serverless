import express from "express";
import { getLatestNews } from "../aws/lambda/util/api/bing.api";

const newsRoutes = express.Router();

newsRoutes.get("/latest", async (req, res) => {
  const result = await getLatestNews();
  return res.send(result);
});

export { newsRoutes };
