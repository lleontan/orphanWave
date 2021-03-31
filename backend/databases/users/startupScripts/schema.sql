-- This database is for non-time series data.
CREATE DATABASE IF NOT EXISTS user_db;
USE user_db;
CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    email varchar(64) NOT NULL UNIQUE,
    passhash varchar(255) NOT NULL,
    user_name varchar(64) NOT NULL UNIQUE
);

--This table tells the dataCollector server what it should and already has made
--daily fetch jobs for.
CREATE TABLE IF NOT EXISTS tickerJobs(
  ticker varchar(32) PRIMARY KEY,
  toFollow ENUM('no', 'toFollow', 'followed')
)

--POLYGON
--/v1/meta/symbols/{stocksTicker}/company
CREATE TABLE IF NOT EXISTS tickersPolygon(
  ticker varchar(32) PRIMARY KEY,
  name varchar(64) NOT NULL,
  description varchar(512) NOT NULL,
  logoUrl varchar(255),
  cik int,
  bloomberg varchar(255),
  country varchar(32),
  industry varchar(64),
  sector varchar(64)
  marketcap float,
  employees int,
  phone varchar(64),
  ceo varchar(64),
  url varchar(255),
  exchangeticker varchar(64),
  hq_country varchar(64),
  TYPE varchar(64),
  updated date NOT NULL,
  active boolean NOT NULL
);
CREATE TABLE IF NOT EXISTS dailyTickerStatsPolygon(
  ticker varchar(32) NOT NULL,
  dateCollected: Date NOT NULL,
  volume int,
  volumeWeighted int,
  OPEN float,
  CLOSE float,
  high float,
  low float,
  unixTimestamp int(11),
  transactions int,
  PRIMARY KEY (ticker, dateCollected)
);

CREATE TABLE IF NOT EXISTS dailyTickerStatsIex(
  ticker varchar(32) NOT NULL,
  dateCollected: Date NOT NULL,
  marketcap: float,
  week52high: float,
  week52low: float,
  week52highSplitAdjustOnly:float,
  week52lowSplitAdjustOnly: float,
  sharesOutstanding: int,
  activeFloat: int,
  avg10Volume:Int,
  avg30Volume: Int,
  day200MovingAvg: float,
  day50MovingAvg: float,
  ttmEPS: float,
  ttmDividendRate:float,
  dividendYield:float,
  nextDividendDate:date,
  exDividendDate: date,
  nextEarningsDate: date,
  peRatio: float,
  beta: float,
  maxChangePercent: float,
  year5ChangePercent float,
  year2ChangePercent float,
  year1ChangePercent float,
  ytdChangePercent float,
  month6ChangePercent float,
  month3ChangePercent float,
  month1ChangePercent float,
  day30ChangePercent float,
  day5ChangePercent float,
  PRIMARY KEY (ticker, dateCollected)
);
CREATE TABLE IF NOT EXISTS tickerSimilar(
  ticker varchar(32) NOT NULL,
  similarticker varchar(32) NOT NULL,
  PRIMARY KEY (ticker, similarticker)
);
CREATE TABLE IF NOT EXISTS tickerFields(
  ticker varchar(32) NOT NULL,
  field varchar(32) NOT NULL,
  PRIMARY KEY (ticker, field)
);
CREATE TABLE IF NOT EXISTS exchanges(
  exchangeticker varchar(32) PRIMARY KEY,
  exchangeName varchar(64) NOT NULL
);
CREATE TABLE IF NOT EXISTS userSubscriptions(
  email varchar(64) NOT NULL,
  ticker varchar(32) NOT NULL,
  watchlistUtility int DEFAULT 0 NOT NULL,
  PRIMARY KEY (email, ticker)
);

--UNDER NO CIRCUMSTANCES REORDER THIS SCHEMA
--WITHOUT ALSO CHANGING THE DATABASE QUERY STRING IN CONSTANTS.JS
CREATE TABLE IF NOT EXISTS tickerFinancialsPolygon(
  ticker varchar(32) NOT NULL,
  period varchar(32) NOT NULL,
  calendarDate date NOT NULL,
  reportPeriod date,
  updated date,
  dateKey date,
  accumulatedOtherComprehensiveIncome int,
  assets int,
  assetsCurrent int,
  assetsNonCurrent int,
  bookValuePerShare float,
  capitalExpenditure int,
  cashAndEquivalents int,
  cashAndEquivalentsUSD int,
  costOfRevenue int,
  consolidatedIncome int,
  currentRatio float,
  debtToEquityRatio float,
  debt int,
  debtCurrent int,
   debtNonCurrent int,
   debtUSD int,
   deferredRevenue int,
   depreciationAmortizationAndAccretion int,
   deposits int,
   dividendYield float,
   dividendsPerBasicCommonShare float,
   earningBeforeInterestTaxes int,
   earningsBeforeInterestTaxesDepreciationAmortization int,
   EBITDAMargin float,
   earningsBeforeInterestTaxesDepreciationAmortizationUSD int,
   earningBeforeInterestTaxesUSD int,
   earningsBeforeTax int,
   earningsPerBasicShare float,
   earningsPerDilutedShare float,
   earningsPerBasicShareUSD float,
   shareholdersEquity int,
   shareholdersEquityUSD int,
   enterpriseValue int,
   enterpriseValueOverEBIT int,
   enterpriseValueOverEBITDA float,
   freeCashFlow int,
   freeCashFlowPerShare int,
   foreignCurrencyUSDExchangeRate float,
   grossProfit float,
   grossMargin float,
   goodwillAndIntangibleAssets int,
   interestExpense float,
   investedCapital int,
   inventory int,
   investments int,
   investmentsCurrent int,
   investmentsNonCurrent int,
   totalLiabilities int,
   currentLiabilities int,
   liabilitiesNonCurrent int,
   marketCapitalization int,
   netCashFlow int,
   netCashFlowBusinessAcquisitionsDisposals int,
   issuanceEquityShares int,
   issuanceDebtSecurities int,
   paymentDividendsOtherCashDistributions int,
   netCashFlowFromFinancing int,
   netCashFlowFromInvesting int,
   netCashFlowInvestmentAcquisitionsDisposals int,
   netCashFlowFromOperations int,
   effectOfExchangeRateChangesOnCash int,
   netIncome int,
   netIncomeCommonStock int,
   netIncomeCommonStockUSD int,
   netLossIncomeFromDiscontinuedOperations int,
   netIncomeToNonControllingInterests int,
   profitMargin float,
   operatingExpenses int,
   operatingIncome int,
   tradeAndNonTradePayables int,
   payoutRatio float,
   priceToBookValue float,
   priceEarnings float,
   priceToEarningsRatio float,
   propertyPlantEquipmentNet int,
   preferredDividendsIncomeStatementImpact int,
   sharePriceAdjustedClose float,
   priceSales float,
   priceToSalesRatio float,
   tradeAndNonTradeReceivables int,
   accumulatedRetainedEarningsDeficit int,
   revenues int,
   revenuesUSD int,
   researchAndDevelopmentExpense int,
   shareBasedCompensation int,
   sellingGeneralAndAdministrativeExpense int,
   shareFactor float,
   shares int,
   weightedAverageShares int,
   weightedAverageSharesDiluted int,
   salesPerShare float,
   tangibleAssetValue int,
   taxAssets int,
   incomeTaxExpense int,
   taxLiabilities int,
   tangibleAssetsBookValuePerShare float,
   workingCapital int,
   PRIMARY KEY (ticker, period, calendarDate)
)
