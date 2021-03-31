module.exports = {
    DATA_DB_NAME:"orphanWaveIndicators",
    DATA_DB_URL:"mongodb://localhost:27017/",
    BASE_IEX_URL:"https://cloud.iexapis.com/stable/",
    RELEASE_DATE_STR:"releaseDate",
    LOCAL_PORT:8000,
    HOST_NAME:"127.0.0.1",
    BASE_POLYGON_URL:"https://api.polygon.io/",
    LOCAL_PORT_DATACOLLECTOR:"8030",
    HOST_NAME_DATACOLLECTOR:"127.0.0.1",
    POLYGON:{
      NOT_AVAILABLE_MESSAGE:"Polygon api Not active",
      TOKEN_ARGUMENT:"apiKey=",
      FINANCIALS_QUESTION_MARKS:"?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"+
      "?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"+
      "?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"+
      "?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"+
      "?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"+
      "?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"+
      "?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"+
      "?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"+
      "?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"+
      "?, ?, ?, ?, ?, ?, ?, ?, ?, ?,"+
      +"?, ?, ?",
      FINANCIALS_INSERT:"insert into tickerFinancialsPolygon("+
        "ticker,period,calendarDate,reportPeriod,updated,"+
        "dateKey,accumulatedOtherComprehensiveIncome,assets,"+
        "assetsCurrent,assetsNonCurrent,bookValuePerShare,capitalExpenditure,"+
        "cashAndEquivalents,cashAndEquivalentsUSD,costOfRevenue,"+
        "consolidatedIncome,currentRatio,debtToEquityRatio,debt,"+
        "debtCurrent,debtNonCurrent,debtUSD,deferredRevenue,"+
        "depreciationAmortizationAndAccretion,deposits,dividendYield,"+
        "dividendsPerBasicCommonShare,earningBeforeInterestTaxes,"+
        "earningsBeforeInterestTaxesDepreciationAmortization,EBITDAMargin,"+
        "earningsBeforeInterestTaxesDepreciationAmortizationUSD,earningBeforeInterestTaxesUSD,"+
        "earningsBeforeTax,earningsPerBasicShare,earningsPerDilutedShare,"+
        "earningsPerBasicShareUSD,shareholdersEquity,shareholdersEquityUSD,enterpriseValue,"+
        "enterpriseValueOverEBIT,enterpriseValueOverEBITDA,freeCashFlow,freeCashFlowPerShare,foreignCurrencyUSDExchangeRate,grossProfit,"+
        "grossMargin,goodwillAndIntangibleAssets,interestExpense,investedCapital,"+
        "inventory,investments,investmentsCurrent,investmentsNonCurrent,"+
        "totalLiabilities,currentLiabilities,liabilitiesNonCurrent,marketCapitalization,"+
        "netCashFlow,netCashFlowBusinessAcquisitionsDisposals,issuanceEquityShares,issuanceDebtSecurities,paymentDividendsOtherCashDistributions,"+
        "netCashFlowFromFinancing,netCashFlowFromInvesting,netCashFlowInvestmentAcquisitionsDisposals,"+
        "netCashFlowFromOperations,effectOfExchangeRateChangesOnCash,"+
        "netIncome,netIncomeCommonStock,"+
        "netIncomeCommonStockUSD,netLossIncomeFromDiscontinuedOperations,"+
        "netIncomeToNonControllingInterests,profitMargin,operatingExpenses,"+
        "operatingIncome,tradeAndNonTradePayables,payoutRatio,priceToBookValue,"+
        "priceEarnings,priceToEarningsRatio,propertyPlantEquipmentNet,"+
        "preferredDividendsIncomeStatementImpact,sharePriceAdjustedClose,priceSales,"+
        "priceToSalesRatio,tradeAndNonTradeReceivables,accumulatedRetainedEarningsDeficit,"+
        "revenues,revenuesUSD,researchAndDevelopmentExpense,"+
        "shareBasedCompensation,sellingGeneralAndAdministrativeExpense,"+
        "shareFactor,shares,weightedAverageShares,weightedAverageSharesDiluted,"+
        "salesPerShare,tangibleAssetValue,taxAssets,incomeTaxExpense,taxLiabilities,"+
        "tangibleAssetsBookValuePerShare,workingCapital)",
    },
    ROUTES:{
      GET_IEX_STATUS:"/status"
    },
    USER_DATABASE:{
      MIN_USERNAME_LENGTH:1,
      DEFAULT_USER_DB_PORT:3030,
      NO_CLIENT_CONNECTION:"User database client has no connection"
    },
    IEX:{
      STATUS_ROUTE:"status",
      NOT_AVAILABLE_MESSAGE:"IEX Not active",
      CPI_ROUTE:"data-points/market/CPIAUCSL",
      UNEMPLOYMENT_RATE_DATAPOINTS_ROUTE:"/data-points/market/UNRATE",
      TOKEN_ARGUMENT:"?token=",
      UNEMPLOYMENT_RATE_ROUTE:"time-series/economic/UNRATE"
    }
};
