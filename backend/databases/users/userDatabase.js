// This file handles read/writes from the mysql user database. Documentation available at
// https://github.com/mysqljs/mysql IMPORTANT:Polygon api dates are in YYYY-MM-DD format
// compatible with mysql. Don't parse them.
const mysql = require('mysql2');
const constants = require('../../constants');

const options = {
  host: '127.0.0.1',
  user: 'root',
  database: 'user_db',
  port: '4033',
  password: process.env.USER_DB_PASSWORD_OW,
};
const unixTimestampToDate = (unixTimestamp) => new Date(unixTimestamp * 1000).toISOString().slice(0, 10);
const getFinancialTickerArray = (tickerData) => [
  tickerData.ticker,
  tickerData.period,
  tickerData.calendarDate,
  tickerData.reportPeriod,
  tickerData.updated,
  tickerData.dateKey,
  tickerData.accumulatedOtherComprehensiveIncome,
  tickerData.assets,
  tickerData.assetsCurrent,
  tickerData.assetsNonCurrent,
  tickerData.bookValuePerShare,
  tickerData.capitalExpenditure,
  tickerData.cashAndEquivalents,
  tickerData.cashAndEquivalentsUSD,
  tickerData.costOfRevenue,
  tickerData.consolidatedIncome,
  tickerData.currentRatio,
  tickerData.debtToEquityRatio,
  tickerData.debt,
  tickerData.debtCurrent,
  tickerData.debtNonCurrent,
  tickerData.debtUSD,
  tickerData.deferredRevenue,
  tickerData.depreciationAmortizationAndAccretion,
  tickerData.deposits,
  tickerData.dividendYield,
  tickerData.dividendsPerBasicCommonShare,
  tickerData.earningBeforeInterestTaxes,
  tickerData.earningsBeforeInterestTaxesDepreciationAmortization,
  tickerData.EBITDAMargin,
  tickerData.earningsBeforeInterestTaxesDepreciationAmortizationUSD,
  tickerData.earningBeforeInterestTaxesUSD,
  tickerData.earningsBeforeTax,
  tickerData.earningsPerBasicShare,
  tickerData.earningsPerDilutedShare,
  tickerData.earningsPerBasicShareUSD,
  tickerData.shareholdersEquity,
  tickerData.shareholdersEquityUSD,
  tickerData.enterpriseValue,
  tickerData.enterpriseValueOverEBIT,
  tickerData.enterpriseValueOverEBITDA,
  tickerData.freeCashFlow,
  tickerData.freeCashFlowPerShare,
  tickerData.foreignCurrencyUSDExchangeRate,
  tickerData.grossProfit,
  tickerData.grossMargin,
  tickerData.goodwillAndIntangibleAssets,
  tickerData.interestExpense,
  tickerData.investedCapital,
  tickerData.inventory,
  tickerData.investments,
  tickerData.investmentsCurrent,
  tickerData.investmentsNonCurrent,
  tickerData.totalLiabilities,
  tickerData.currentLiabilities,
  tickerData.liabilitiesNonCurrent,
  tickerData.marketCapitalization,
  tickerData.netCashFlow,
  tickerData.netCashFlowBusinessAcquisitionsDisposals,
  tickerData.issuanceEquityShares,
  tickerData.issuanceDebtSecurities,
  tickerData.paymentDividendsOtherCashDistributions,
  tickerData.netCashFlowFromFinancing,
  tickerData.netCashFlowFromInvesting,
  tickerData.netCashFlowInvestmentAcquisitionsDisposals,
  tickerData.netCashFlowFromOperations,
  tickerData.effectOfExchangeRateChangesOnCash,
  tickerData.netIncome,
  tickerData.netIncomeCommonStock,
  tickerData.netIncomeCommonStockUSD,
  tickerData.netLossIncomeFromDiscontinuedOperations,
  tickerData.netIncomeToNonControllingInterests,
  tickerData.profitMargin,
  tickerData.operatingExpenses,
  tickerData.operatingIncome,
  tickerData.tradeAndNonTradePayables,
  tickerData.payoutRatio,
  tickerData.priceToBookValue,
  tickerData.priceEarnings,
  tickerData.priceToEarningsRatio,
  tickerData.propertyPlantEquipmentNet,
  tickerData.preferredDividendsIncomeStatementImpact,
  tickerData.sharePriceAdjustedClose,
  tickerData.priceSales,
  tickerData.priceToSalesRatio,
  tickerData.tradeAndNonTradeReceivables,
  tickerData.accumulatedRetainedEarningsDeficit,
  tickerData.revenues,
  tickerData.revenuesUSD,
  tickerData.researchAndDevelopmentExpense,
  tickerData.shareBasedCompensation,
  tickerData.sellingGeneralAndAdministrativeExpense,
  tickerData.shareFactor,
  tickerData.shares,
  tickerData.weightedAverageShares,
  tickerData.weightedAverageSharesDiluted,
  tickerData.salesPerShare,
  tickerData.tangibleAssetValue,
  tickerData.taxAssets,
  tickerData.incomeTaxExpense,
  tickerData.taxLiabilities,
  tickerData.tangibleAssetsBookValuePerShare,
  tickerData.workingCapital,
];
// Returns a connection pool object
const connectPool = () => {
  const pool = mysql.createPool(options);

  /* pool.connect(function(err) {
    if (err) {
      throw new Error('error connecting: ' + err.stack);
    } else {
      console.log('connected as id ' + pool.threadId);
    }
  }); */
  return pool;
};
const getFirstInQuery = (queryResults) => queryResults[0];
class UserDatabasePool {
  constructor() {
    this.pool = connectPool();
  }

  getUserEmailExists(email, callback) {
    // returns true if the user does not exist within the database, and the database is available.
    this.pool.query(
      'Select email from users where `email` = ?',
      [email],
      (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
          callback(true);
        } else {
          callback(false);
        }
      },
    );
  }

  getUser(email, callback) {
    this.pool.query(
      'Select * from users where `email` = ? limit 1',
      [email],
      (error, results, fields) => {
        if (error) throw error;
        callback(getFirstInQuery(results));
      },
    );
  }

  getUsernameExists(username, callback) {
    // Returns true if the username is not taken already
    this.pool.query(
      'Select user_name from users where `user_name` = ?',
      [username],
      (error, results, fields) => {
        if (error) throw error;
        if (results.length > 0) {
          callback(true);
        } else {
          callback(false);
        }
      },
    );
  }

  getPasswordHash(email, callback) {
    this.pool.query(
      'Select passhash from users where `email` = ? limit 1',
      [email],
      (error, results, fields) => {
        if (error) {
          console.log('password comparison err:', error);
          callback(error, null);
        } else {
          callback(error, getFirstInQuery(results));
        }
      },
    );
  }

  // uses a callback
  addUser(userData, callback) {
    this.pool.query('insert into users (email, passhash, user_name) VALUES (?, ?, ?)', [
      userData.email, userData.passhash, userData.username,
    ], callback);
  }

  changePasshash(newPasshash, callback) {
    this.pool.query(
      'UPDATE customers SET passhash = ?',
      [newPasshash],
      (error, results, fields) => {
        if (error) {
          throw error;
        }
        callback(results, fields);
      },
    );
  }

  changeUsername(newUsername, callback) {
    this.pool.query(
      'UPDATE customers SET user_name = ?',
      [newUsername],
      (error, results, fields) => {
        if (error) {
          throw error;
        }
        callback(results, fields);
      },
    );
  }

  getBasicUserData(email, callback) {
    this.pool.query(
      'Select user_name, email from users where `email` = ? limit 1',
      [email],
      (error, results, fields) => {
        if (error) {
          throw error;
        }
        console.log(results);
        callback(error, getFirstInQuery(results), fields);
      },
    );
  }

  getSetOfFollowedTickers(callback) {
    this.pool.query(
      'Select DISTINCT ticker from userSubscriptions where `watchlistUtility` > 0 limit 500',
      [],
      (error, results, fields) => {
        if (error) {
          throw error;
        }
        console.log(results);
        callback(error, results, fields);
      },
    );
  }

  // Inserts an entry into dailyTickerStatsPolygon
  insertDailyTickerStatsPolygon(tickerData, callback) {
    const queryStr = 'insert into dailyTickerStatsPolygon(ticker, dateCollected, volume,volumeWeighted,OPEN,CLOSE,h'
        + 'igh,low,unixTimestamp,transactions)VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)';
    this.pool.query(queryStr, [
      tickerData.ticker,
      unixTimestampToDate(tickerData.unixTimestamp),
      tickerData.volume,
      tickerData.volumeWeighted,
      tickerData.open,
      tickerData.close,
      tickerData.high,
      tickerData.low,
      tickerData.unixTimestamp,
      tickerData.transactions,
    ], (error, results, fields) => {
      if (error) {
        throw error;
      }
      console.log(results);
      callback(error, results, fields);
    });
  }

  // Takes a [] of groupedTickerStats {}
  insertAllDailyTickerStatsPolygon(allTickersList, callback) {
    const destructuredArray = allTickersList.map((tickerData) => [
      tickerData.ticker,
      unixTimestampToDate(tickerData.unixTimestamp),
      tickerData.volume,
      tickerData.volumeWeighted,
      tickerData.open,
      tickerData.close,
      tickerData.high,
      tickerData.low,
      tickerData.unixTimestamp,
      tickerData.transactions,
    ]);
    const queryStr = 'insert into dailyTickerStatsPolygon (ticker, dateCollected, volume, volumeWeighted, OPEN,CLOS'
        + 'E, high,low,unixTimestamp,transactions) VALUES ?';
    this.pool.query(queryStr, [destructuredArray], (error, results, fields) => {
      if (error) {
        throw error;
      }
      console.log('Mass add results:', results);
      callback(error, results, fields);
    });
  }

  // Takes an array of financial jsons for one ticker
  insertTickerFinancialsPolygon(tickerDataArray, callback) {
    const queryStr = `${constants.FINANCIALS_INSERT} VALUES (${constants.FINANCIALS_QUESTION_MARKS
    })`;

    const transformedDataList = tickerDataArray.map((entry) => getFinancialTickerArray(entry));
    this.pool.query(queryStr, [transformedDataList], (error, results, fields) => {
      if (error) {
        throw error;
      }
      console.log(results);
      callback(error, results, fields);
    });
  }

  setAllSubscriptionsFollowed(callback){
    const queryStr="update tickerJobs set toFollow ='followed' where toFollow='toFollow'";
    this.pool.query(queryStr, [], (error, results, fields) => {
      if (error) {
        throw error;
      }
      callback(error, results, fields);
    });
  };

  //Sets or inserts a users subscription utility for a specific ticker
  replaceIntoUserSubscription(email,ticker,newUtility,callback){
    const queryStr="replace INTO userSubscriptions (email,ticker,watchlistUtility) values (?,?,?)";
    this.pool.query(queryStr, [email,ticker,newUtility], (error, results, fields) => {
      if (error) {
        throw error;
      }
      callback(error, results, fields);
    });
  }
  //Sets or inserts a users subscription utility for a specific ticker
  replaceTickerJobsRow(ticker,newValue,callback){
    const queryStr="replace INTO tickerJobs (ticker,newValue) values (?,?)";
    this.pool.query(queryStr, [ticker,newValue], (error, results, fields) => {
      if (error) {
        throw error;
      }
      callback(error, results, fields);
    });
  }
  getTickerJobsRow(ticker,callback){
    this.pool.query(
      'Select toFollow from tickerJobs where `ticker` = ? limit 1',
      [ticker],
      (error, results, fields) => {
        if (error) {
          throw error;
        }
        console.log(results);
        callback(error, getFirstInQuery(results), fields);
      },
    );
  }
  //When a user ADDS a new ticker to their subscriptions.
  insertUserTickerSubscription(email,ticker,callback){
    //add the subscription to the users profile in `userSubscriptions` table
    this.replaceIntoUserSubscription(email,ticker,1,(error, results, fields)=>{
      //check whether the subscription has ever been followed.
      getTickerJobsRow(email,(error, result, fields)=>{
        if(result=='no'||result==null){
          replaceTickerJobsRow(ticker,'toFollow',(error, results, fields)=>{
            console.log("Set job level of:",ticker," to toFollow");
            callback();
          });
        }else{
          callback();
        }
      });
    });
    getTickerSubscriptionsByValue(value,callback){
      this.pool.query(
        'Select ticker from tickerJobs where `toFollow` = ?',
        [value],
        (error, results, fields) => {
          if (error) {
            throw error;
          }
          callback(error, results, fields);
        },
      );
    }

  }
  handleDisconnect() {
    /* let sleepDuration = 1000;
      console.log("Attempting user db reconnect", sleepDuration);
      await sleep(sleepDuration);
      connect(); */
  }
}

const makePool = () => new UserDatabasePool();
const defaultInstance = makePool();
module.exports.makePool = makePool;
module.exports.UserDatabasePool = UserDatabasePool;
module.exports.defaultInstance = defaultInstance;
