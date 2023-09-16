import express from "express";
import {
  cronFetchHistoricData,
  cronFetchKeyStat,
  fetchBalanceSheet,
  fetchEarnings,
  fetchFinanceAnalytics,
  fetchHistoricData,
  fetchKeyStat,
  fetchStockPrice,
} from "../aws/lambda/util/api";

const stockRoutes = express.Router();

// http://localhost:3000/stock/historic
// {
//   "symbol": "1155.KL",
//   "interval": "1d",
//   "range": "1m"
// }
stockRoutes.post("/historic", async (req, res) => {
  const isClient = req.query.client;
  const result = isClient
    ? await fetchHistoricData(req.body)
    : await cronFetchHistoricData({
        symbols: ["1155.KL", "7100.KL"],
        interval: "1d",
        range: "1m",
      });
  return res.send(result);
});

// http://localhost:3000/stock/key-stat/1155.KL
stockRoutes.get("/key-stat/:symbol", async (req, res) => {
  const isClient = req.query.client;
  const result = isClient
    ? await fetchKeyStat(req.params)
    : await cronFetchKeyStat({
        symbols: ["1155.KL", "7100.KL"],
      });
  return res.send(result);
});

stockRoutes.get("/balance-sheet/:symbol", async (req, res) => {
  const result = await fetchBalanceSheet(req.params);
  return res.send(result);
});

stockRoutes.get("/price/:symbol", async (req, res) => {
  const result = await fetchStockPrice(req.params);
  return res.send(result);
});

stockRoutes.get("/earnings/:symbol", async (req, res) => {
  const result = await fetchEarnings(req.params);
  return res.send(result);
});

stockRoutes.get("/finance-analytics/:symbol", async (req, res) => {
  const result = await fetchFinanceAnalytics(req.params);
  return res.send(result);
});

export { stockRoutes };
