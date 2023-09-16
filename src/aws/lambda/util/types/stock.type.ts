export interface HistoricDataRes {
  data: {
    meta: {
      currency: string;
      symbol: string;
      exchangeName: string;
      instrumentType: string;
      firstTradeDate: number;
      regularMarketTime: number;
      gmtoffset: number;
      timezone: string;
      exchangeTimezoneName: string;
      regularMarketPrice: number;
      chartPreviousClose: number;
      priceHint: number;
      currentTradingPeriod: {
        pre: CurrentTradingPeriodData;
        regular: CurrentTradingPeriodData;
        post: CurrentTradingPeriodData;
      };
      dataGranularity: string;
      range: string;
      validRanges: string[];
    };
    timestamp: number[];
    indicators: {
      quote: StockDataIndicatorsQuote[];
      adjclose: {
        adjclose: number[];
      };
    };
  };
}

interface CurrentTradingPeriodData {
  timezone: string;
  end: number;
  start: number;
  gmtoffset: number;
}

export interface StockDataIndicatorsQuote {
  volume: number[];
  high: number[];
  open: number[];
  low: number[];
  close: number[];
}

export interface KeyStatRes {
  data: {
    maxAge: number;
    priceHint: KeyStatData;
    enterpriseValue: KeyStatData;
    forwardPE: KeyStatData;
    profitMargins: KeyStatData;
    floatShares: KeyStatData;
    sharesOutstanding: KeyStatData;
    sharesShort: KeyStatData;
    sharesShortPriorMonth: KeyStatData;
    sharesShortPreviousMonthDate: KeyStatData;
    dateShortInterest: KeyStatData;
    sharesPercentSharesOut: KeyStatData;
    heldPercentInsiders: KeyStatData;
    heldPercentInstitutions: KeyStatData;
    shortRatio: KeyStatData;
    shortPercentOfFloat: KeyStatData;
    beta: KeyStatData;
    impliedSharesOutstanding: KeyStatData;
    morningStarOverallRating: KeyStatData;
    morningStarRiskRating: KeyStatData;
    category: string | null;
    bookValue: KeyStatData;
    priceToBook: KeyStatData;
    annualReportExpenseRatio: KeyStatData;
    ytdReturn: KeyStatData;
    beta3Year: KeyStatData;
    totalAssets: KeyStatData;
    yield: KeyStatData;
    fundFamily: string | null;
    fundInceptionDate: KeyStatData;
    legalType: string | null;
    threeYearAverageReturn: KeyStatData;
    fiveYearAverageReturn: KeyStatData;
    priceToSalesTrailing12Months: KeyStatData;
    lastFiscalYearEnd: KeyStatData;
    nextFiscalYearEnd: KeyStatData;
    mostRecentQuarter: KeyStatData;
    earningsQuarterlyGrowth: KeyStatData;
    revenueQuarterlyGrowth: KeyStatData;
    netIncomeToCommon: KeyStatData;
    trailingEps: KeyStatData;
    forwardEps: KeyStatData;
    pegRatio: KeyStatData;
    lastSplitFactor: string | null;
    lastSplitDate: KeyStatData;
    enterpriseToRevenue: KeyStatData;
    enterpriseToEbitda: KeyStatData;
    "52WeekChange": KeyStatData;
    SandP52WeekChange: KeyStatData;
    lastDividendValue: KeyStatData;
    lastDividendDate: KeyStatData;
    lastCapGain: KeyStatData;
    annualHoldingsTurnover: KeyStatData;
  };
}

interface KeyStatData {
  raw?: number;
  fmt?: string;
  longFmt?: string;
}

export interface BalanceSheetRes {
  data: {
    balanceSheetStatements: BalanceSheetData[];
    maxAge: number;
  };
}

interface BalanceSheetData {
  maxAge: number;
  endDate: KeyStatData;
  cash: KeyStatData;
  inventory: KeyStatData;
  propertyPlantEquipment: KeyStatData;
  deferredLongTermAssetCharges: KeyStatData;
  totalAssets: KeyStatData;
  accountsPayable: KeyStatData;
  otherCurrentLiab: KeyStatData;
  minorityInterest: KeyStatData;
  totalLiab: KeyStatData;
  commonStock: KeyStatData;
  retainedEarnings: KeyStatData;
  treasuryStock: KeyStatData;
  otherStockholderEquity: KeyStatData;
  totalStockholderEquity: KeyStatData;
  netTangibleAssets: KeyStatData;
}

export interface StockPriceRes {
  data: {
    maxAge: number;
    preMarketChange: KeyStatData;
    preMarketPrice: KeyStatData;
    postMarketChange: KeyStatData;
    postMarketPrice: KeyStatData;
    regularMarketChangePercent: KeyStatData;
    regularMarketChange: KeyStatData;
    regularMarketTime: number;
    priceHint: KeyStatData;
    regularMarketPrice: KeyStatData;
    regularMarketDayHigh: KeyStatData;
    regularMarketDayLow: KeyStatData;
    regularMarketVolume: KeyStatData;
    averageDailyVolume10Day: KeyStatData;
    averageDailyVolume3Month: KeyStatData;
    regularMarketPreviousClose: KeyStatData;
    regularMarketSource: string;
    regularMarketOpen: KeyStatData;
    strikePrice: KeyStatData;
    openInterest: KeyStatData;
    exchange: string;
    exchangeName: string;
    exchangeDataDelayedBy: number;
    marketState: string;
    quoteType: string;
    symbol: string;
    underlyingSymbol: string | null;
    shortName: string;
    longName: string;
    currency: string;
    quoteSourceName: string;
    currencySymbol: string;
    fromCurrency: string | null;
    toCurrency: string | null;
    lastMarket: string | null;
    volume24Hr: KeyStatData;
    volumeAllCurrencies: KeyStatData;
    circulatingSupply: KeyStatData;
    marketCap: KeyStatData;
  };
}

interface QuarterlyEarnings {
  date: string;
  actual: KeyStatData;
  estimate: KeyStatData;
}

interface FinancialsChart {
  date: string;
  revenue: KeyStatData;
  earnings: KeyStatData;
}

export interface EarningsRes {
  data: {
    maxAge: number;
    earningsChart: {
      quarterly: QuarterlyEarnings[];
      currentQuarterEstimate: KeyStatData;
      currentQuarterEstimateDate: string;
      currentQuarterEstimateYear: number;
      earningsDate: KeyStatData[];
    };
    financialsChart: {
      yearly: FinancialsChart[];
      quarterly: FinancialsChart[];
    };
    financialCurrency: string;
  };
}

export interface FinanceAnalysisRes {
  data: {
    maxAge: number;
    currentPrice: KeyStatData;
    targetHighPrice: KeyStatData;
    targetLowPrice: KeyStatData;
    targetMeanPrice: KeyStatData;
    targetMedianPrice: KeyStatData;
    recommendationMean: KeyStatData;
    recommendationKey: string;
    numberOfAnalystOpinions: KeyStatData;
    totalCash: KeyStatData;
    totalCashPerShare: KeyStatData;
    ebitda: KeyStatData;
    totalDebt: KeyStatData;
    quickRatio: KeyStatData;
    currentRatio: KeyStatData;
    totalRevenue: KeyStatData;
    debtToEquity: KeyStatData;
    revenuePerShare: KeyStatData;
    returnOnAssets: KeyStatData;
    returnOnEquity: KeyStatData;
    grossProfits: KeyStatData;
    freeCashflow: KeyStatData;
    operatingCashflow: KeyStatData;
    earningsGrowth: KeyStatData;
    revenueGrowth: KeyStatData;
    grossMargins: KeyStatData;
    ebitdaMargins: KeyStatData;
    operatingMargins: KeyStatData;
    profitMargins: KeyStatData;
    financialCurrency: string;
  };
}
