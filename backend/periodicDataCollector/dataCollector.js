const schedule = require('node-schedule');
const express = require('express');
const constants = require('../constants');
const userDb = require('../databases/users/UserDatabase');
const PolygonApi = require('../helpers/apiFetchPolygon');

const polygonApi = PolygonApi.PolygonApi();
const IexApi = require('../helpers/apiFetchIEX');

const iexApi = IexApi.IexApi();
const app = express();

const cpiMonthlyCollection = {
  name: 'us_cpi_monthly',
  route: 'data-points/market/CPIAUCSL',
  api: 'iex',
};
const unemploymentRateWeekly = {
  name: 'unemployment_rate_weekly',
  route: 'time-series/economic/UNRATE',
  api: 'iex',
};
const gdpGrowthQuarterly = {
  name: 'gdp_growth_quarterly',
  route: '/data-points/market/A191RL1Q225SBEA',
  api: 'iex',
};

// If PREFORM_INITIAL_DATABASE_GETS is true then on start
// financial pulls will be scheduled from the last 12 months once in addition to the normal scheduling.
const PREFORM_INITIAL_DATABASE_GETS = true;

// A map of TICKERS to JOBS
let dailyAllFollowedTickersJobs = {};
/*
//Schedules the daily update all openCloseStats on all tickers.
//Schedules monthly GDP, CPI, gets
//Schedules daily individual ticker gets

BASICALLY: If you want to schedule some api requests, ssh into the remote with a password.
Use the dataCollector cli client to add some get requests to the queue.
https://crontab.guru/#*_*_*_*_* for syntax help.
for exact date use a new Date(2012, 11, 21, 5, 30, 0);
  On start: load in a list of tickers to preform periodic recordings on from userDb.
  Start cron jobs for the collected tickers and the default economic indicators.
  *    *    *    *    *    *
  ┬    ┬    ┬    ┬    ┬    ┬
  │    │    │    │    │    │
  │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
  │    │    │    │    └───── month (1 - 12)
  │    │    │    └────────── day of month (1 - 31)
  │    │    └─────────────── hour (0 - 23)
  │    └──────────────────── minute (0 - 59)
  └───────────────────────── second (0 - 59, OPTIONAL)

For scheduled jobs make a cronjob that makes calls with a 20 second delay to polygon.
For iex jobs
*/

// This function creates a list of every ticker
// That has ever been followed by at least one user.
const getAllTickersWithToFollowValue = (toFollowValue, callback) => {
  userDb.getTickerSubscriptionsByValue(toFollowValue, (error, results, fields) => {
    callback(results);
  });
};
const scheduleGetDailyOpenClose = (callback) => {
  console.log('Scheduling daily all market tickers fetch.');
  // “At 4:01pm on every day-of-month if it's on every day-of-week from Monday through Friday.”
  const scheduleString = '1 16 */1 * 1-5';
  const newJob = schedule.scheduleJob(scheduleString, () => {
    const today = new Date();
    const dateStr = today.toISOString().slice(0, 10);
    console.log('Getting All market ranges for ', dateStr);
    const options = { date: dateStr, unadjusted: 'true' };
    polygonApi.fetchGetDailyOpenCloseAllTickers(options, (results) => {
      console.log('Daily data collected for ', dateStr);
      userDb.insertAllDailyTickerStatsPolygon(results.results, (error, dbResults, fields) => {
        if (error) {
          throw error;
        } else {
          console.log('Successfully inserted AllTickerStats');
        }
      });
    });
  });
  callback();
};

const databaseInitialization = () => {
  console.log('Pulling financials on all subscribed tickers for the last 12 months.');
  collectFollowedTickers((followedTickers) => {

  });
};

// This function schedules individual jobs for the set of tickers.
// Tickers set is the set of tickers to pass in.
// callFunction(ticker) is the function that is actually called per day. Passes in a "ticker" as an argument.
// callback(jobsList) is the function that is called when all jobs are SCHEDULED. The list of jobs is passed in as an argument.
const scheduleDailyJobs = (tickersSet, callFunction, callback, hourCounterStart, pushToMap) => {
  console.log('Scheduling individual jobs');
  const jobsList = [];
  let minuteCounter = 0;
  const maxMinutePlace = 59;
  let hourCounter = hourCounterStart || 1;
  const maxHourCounter = 23;
  const options = { limit: 1, type: 'T', sort: '-reportPeriod' };
  tickersSet.forEach((ticker) => {
    // Every day at an incrementing minute and hour
    if (minuteCounter > maxMinutePlace) {
      minuteCounter = 0;
      hourCounter += 1;
    }
    if (hourCounter > maxHourCounter) {
      // It should be okay to schedule less than 5 jobs at the same time.
      hourCounter = 0;
    }
    const scheduleString = `${minuteCounter} ${hourCounter} */1 * *`;
    const newJob = schedule.scheduleJob(scheduleString, callFunction(ticker, options));
    jobsList.push(newJob);
    if(pushToMap){
      pushToMap[ticker]=newJob;
    }
  });
  callback(jobsList);
};

const collectTickersAndRescheduleFetches = () => {
  console.log('Collecting tickers to update from database.');
  collectFollowedTickers((followedTickers) => {
    console.log('Successfully updated tickers list.');

    scheduleDailyTickerGetJobs(followedTickers, (tickerName) => {
      dailyFinancialGetJobsList = polygonApi.getWriteFinancials(options, tickerName);
    }, (jobsList) => {
      console.log('Successfully updated tickers list.');
    }, 1);
  });
};
const initializeFollowedSubscriptions=(tickerSubscriptionValue)=>{
  getAllTickersWithToFollowValue(tickerSubscriptionValue, (toFollowTickersList) => {
    scheduleDailyJobs(toFollowTickersList, (ticker, options) => {
      const financialsOptions = {
        sort: '-reportPeriod',
        type: 'T'
      };
      apiFetchPolygon.getWriteFinancials(financialsOptions, ticker);
    }, (followedJobsList) => {
      console.log("->",followedJobsList.length,' jobs scheduled.');
    }, 1,dailyAllFollowedTickersJobs);
  });
};
const onStart = () => {
  // “At 00:05.” am everyday, retrieve a list of all not yet followed subscriptions
  //IMPORTANT: ALL JOBS ARE PLACED WITHIN THE dailyAllFollowedTickersJobs MAP.
  const updateSubscriptionsFromDatabaseJobs = schedule.scheduleJob('5 0 */1 * *', () => {
    getAllTickersWithToFollowValue('toFollow', (toFollowTickersList) => {
      scheduleDailyJobs(toFollowTickersList, (ticker, options) => {
        const financialsOptions = {
          sort: '-reportPeriod',
          type: 'T'
        };
        apiFetchPolygon.getWriteFinancials(financialsOptions, ticker,()=>{
          userDb.setAllSubscriptionsFollowed((error, results, fields)=>{
            console.log("Set all toFollow to followed");
          });
        });
      }, (followedJobsList) => {
        console.log("->",followedJobsList.length,' jobs scheduled.');
      }, 1,dailyAllFollowedTickersJobs);
    });
  });
  initializeFollowedSubscriptions("followed");
  scheduleGetDailyOpenClose(() => {
    console.log('Daily market checkup success!');
  });
};

app.get('/', (req, res) => {
  res.send('Orphan Wave Data Collection Server:');
});

app.use(express.json());
app.listen(
  constants.LOCAL_PORT_DATACOLLECTOR,
  constants.HOST_NAME_DATACOLLECTOR,
  () => {
    onStart();
    if (PREFORM_INITIAL_DATABASE_GETS) {
      databaseInitialization();
    }
    console.log(`Orphan Wave Data Collection Server: ${constants.LOCAL_PORT}`);
    console.log(`https://${constants.HOST_NAME}:${constants.LOCAL_PORT}/`);
  },
);
