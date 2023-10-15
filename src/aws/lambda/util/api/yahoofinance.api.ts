/*
 * Yahoo Finance
 * RapidAPI link: https://rapidapi.com/manwilbahaa/api/yahoo-finance127
 *
 * Example params:
 * symbol: "1155.KL"
 * interval: "1d"
 * range: "3d"
 */
import axios from "axios";
import {
  BalanceSheetRes,
  StockPriceRes,
  type HistoricDataRes,
  type KeyStatRes,
  type StockDataIndicatorsQuote,
  EarningsRes,
  FinanceAnalysisRes,
} from "../types";
import { initRedisClient } from "../redis/init";

type AxiosRes<T> = Promise<
  | {
      statusCode: number;
      body: T;
    }
  | Error
>;

interface FetchHistoricDataParams {
  symbol?: string;
  interval?: string;
  range?: string;
}

interface CronFetchHistoricDataParams {
  symbols: string[];
  interval: string;
  range: string;
}

interface FetchKeyStatParams {
  symbol?: string;
}

interface CronFetchKeyStatParams {
  symbols: string[];
}

const constructFetchHistoricDataRequest = (
  symbol: string,
  interval: string,
  range: string
) => {
  const url = `https://yahoo-finance127.p.rapidapi.com/historic/${symbol}/${interval}/${range}`;
  const headers = {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
  };
  return {
    url,
    headers,
  };
};

/*
 * return historic data
 * interval - The time interval between two data points.
 * Can be 1m 2m 5m 15m 30m 60m 90m 1h 1d 5d 1wk 1mo 3mo
 * range - The range for which the data is returned.
 * for normal stocks :
 * you can directly search by tickername:
 * eg. tsla , msft , meta
 *
 * for crypt:
 * try searching by ticker name followed by -USD.
 * for bitcoin try : btc-usd
 */
const fetchHistoricData = async ({
  symbol,
  interval,
  range,
}: FetchHistoricDataParams): AxiosRes<string> => {
  if (!symbol || !interval || !range) return new Error("Missing params");

  const url = `https://yahoo-finance127.p.rapidapi.com/historic/${symbol}/${interval}/${range}`;
  const headers = {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
  };

  try {
    //check cache
    const client = await initRedisClient();

    const redisKey = "historicalData-" + symbol + "-" + interval + "-" + range;

    const value = await client.get(redisKey);

    if (value) {
      return {
        statusCode: 200,
        body: value,
      };
    }

    const { data }: HistoricDataRes = await axios.get(url, {
      headers,
    });

    const body = {
      quote: data.indicators.quote[0],
      timestamp: data.timestamp,
    };

    await client.set(redisKey, JSON.stringify(body));

    return {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  } catch (err) {
    console.log(err);
    return new Error(JSON.stringify(err));
  }
};

const cronFetchHistoricData = async ({
  symbols,
  interval,
  range,
}: CronFetchHistoricDataParams): AxiosRes<string> => {
  try {
    const client = await initRedisClient();

    let body;

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];

      const redisKey =
        "historicalData-" + symbol + "-" + interval + "-" + range;

      const { url, headers } = constructFetchHistoricDataRequest(
        symbol,
        interval,
        range
      );

      const { data }: HistoricDataRes = await axios.get(url, {
        headers,
      });

      body = {
        quote: data.indicators.quote[0],
        timestamp: data.timestamp,
      };

      await client.set(redisKey, JSON.stringify(body));
    }

    return {
      statusCode: 200,
      body: JSON.stringify(body),
    };
  } catch (err) {
    console.log(err);
    return new Error(JSON.stringify(err));
  }
};
/*
 * Key Statistics are important points of financial data that allow you to quickly view and
 * ascertain transaction history, as well as provide insight into donation trends.
 * These statistics can be found both on the Dashboard as entire database summaries and
 * on an individual basis at the top of each entity record.
 */
const fetchKeyStat = async ({
  symbol,
}: FetchKeyStatParams): AxiosRes<KeyStatRes["data"]> => {
  if (!symbol) return new Error("Missing params");

  const url = `https://yahoo-finance127.p.rapidapi.com/key-statistics/${symbol}`;
  const headers = {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
  };

  try {
    //check cache
    const client = await initRedisClient();

    const redisKey = "keyStat-" + symbol;

    const value = await client.get(redisKey);
    if (value) {
      return {
        statusCode: 200,
        body: JSON.parse(value),
      };
    }

    const { data }: KeyStatRes = await axios.get(url, { headers });

    await client.set(redisKey, JSON.stringify(data));

    return {
      statusCode: 200,
      body: data,
    };
  } catch (err) {
    console.log(err);
    return new Error(JSON.stringify(err));
  }
};

const constructFetchKeyStatRequest = (symbol: string) => {
  const url = `https://yahoo-finance127.p.rapidapi.com/key-statistics/${symbol}`;
  const headers = {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
  };
  return {
    url,
    headers,
  };
};

const cronFetchKeyStat = async ({
  symbols,
}: CronFetchKeyStatParams): AxiosRes<undefined> => {
  try {
    const client = await initRedisClient();

    for (let i = 0; i < symbols.length; i++) {
      const symbol = symbols[i];

      const redisKey = "keyStat-" + symbol;

      const { url, headers } = constructFetchKeyStatRequest(symbol);

      const { data }: KeyStatRes = await axios.get(url, { headers });

      await client.set(redisKey, JSON.stringify(data));
    }

    return {
      statusCode: 200,
      body: undefined,
    };
  } catch (err) {
    console.log(err);
    return new Error(JSON.stringify(err));
  }
};

/* A balance sheet is a financial statement that communicates the so-called “book value” of an organization,
 * as calculated by subtracting all of the company's liabilities and shareholder equity from its total assets.
 */
const fetchBalanceSheet = async ({
  symbol,
}: FetchKeyStatParams): AxiosRes<BalanceSheetRes["data"]> => {
  const url = `https://yahoo-finance127.p.rapidapi.com/balance-sheet/${symbol}`;
  const headers = {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
  };

  try {
    const { data }: BalanceSheetRes = await axios.get(url, { headers });
    return {
      statusCode: 200,
      body: data,
    };
  } catch (err) {
    console.log(err);
    return new Error(JSON.stringify(err));
  }
};

/*
 * Returns the Stock Price Information for the symbol passed as parameter
 * for normal stocks :
 * you can directly search by tickername:
 * eg. tsla , msft , meta
 *
 * for crypt:
 * try searching by ticker name followed by -USD.
 * for bitcoin try : btc-usd
 */
const fetchStockPrice = async ({
  symbol,
}: FetchKeyStatParams): AxiosRes<StockPriceRes["data"]> => {
  const url = `https://yahoo-finance127.p.rapidapi.com/price/${symbol}`;
  const headers = {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
  };

  try {
    const { data }: StockPriceRes = await axios.get(url, { headers });
    return {
      statusCode: 200,
      body: data,
    };
  } catch (err) {
    console.log(err);
    return new Error(JSON.stringify(err));
  }
};

/*
 * A company's earnings are its after-tax net income.
 * This is the company's bottom line or its profits.
 * Earnings are perhaps the single most important and most closely studied number in a company's financial statements.
 * This API also returns historical earnings.
 */
const fetchEarnings = async ({
  symbol,
}: FetchKeyStatParams): AxiosRes<EarningsRes["data"]> => {
  const url = `https://yahoo-finance127.p.rapidapi.com/earnings/${symbol}`;
  const headers = {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
  };

  try {
    const { data }: EarningsRes = await axios.get(url, { headers });
    return {
      statusCode: 200,
      body: data,
    };
  } catch (err) {
    console.log(err);
    return new Error(JSON.stringify(err));
  }
};

/*
 * This API endpoint also returns AI recommendation
 * Financial analysis refers to an assessment of the viability, stability, and profitability of a business, sub-business or project.
 * It is performed by professionals who prepare reports using ratios and other techniques,
 * that make use of information taken from financial statements and other reports.
 */
const fetchFinanceAnalytics = async ({
  symbol,
}: FetchKeyStatParams): AxiosRes<FinanceAnalysisRes["data"]> => {
  const url = `https://yahoo-finance127.p.rapidapi.com/finance-analytics/${symbol}`;
  const headers = {
    "X-RapidAPI-Key": process.env.RAPID_API_KEY,
    "X-RapidAPI-Host": process.env.RAPID_API_HOST,
  };

  try {
    const { data }: FinanceAnalysisRes = await axios.get(url, { headers });
    return {
      statusCode: 200,
      body: data,
    };
  } catch (err) {
    console.log(err);
    return new Error(JSON.stringify(err));
  }
};

export {
  fetchHistoricData,
  cronFetchHistoricData,
  fetchKeyStat,
  cronFetchKeyStat,
  fetchBalanceSheet,
  fetchStockPrice,
  fetchEarnings,
  fetchFinanceAnalytics,
};
