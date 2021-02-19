let constants = require('../../constants');
let apiFetch = require("../../apiFetch");
let MongoClient = require('mongodb').MongoClient;
const schedule = require('node-schedule');

const DATA_DB_URL = constants.DATA_DB_URL;
const DATA_DB_NAME = constants.DATA_DB_NAME;
const GENERIC_ERROR_MESSAGE = "Error Occured";
const IEX_NOT_AVAILABLE_MESSAGE = "IEX Not active";


const cpiMonthlyCollection = {
  name: "us_cpi_monthly",
  route: "data-points/market/CPIAUCSL"
};
const unemploymentRateWeekly = {
  name: "unemployment_rate_weekly",
  route: 'time-series/economic/UNRATE'
};
const gdpGrowthQuarterly = {
  name: "gdp_growth_quarterly",
  route: "todo"
};


async function addCollection(collectionData, dbo) {
  return new Promise(function(resolve, reject) {
    let collectionName = collectionData.name;
    console.log("Attempting add " + collectionName);
    dbo.createCollection(collectionName, function(err, res) {
      if (err) {
        console.log("error occurred in dbo.createCollection createMongoDb.js");
        console.log(err);
        reject();
      }
      console.log("Mongo " + collectionName + " collection created!");
      resolve();
    });
  })
}


//Returns the date string
function getNewestDateFromCollection(collection) {
  return collection.find().sort({
    "releaseDate": -1
  }).limit(1);
}


//This function queries IEX for new cpi and quarterly gdp growth
//If the new data is more recent than the old data it is inserted into the collection
//With a daily update check this should add identical datapoints for every day in the time period.
async function updateTimeSeriesFromIex(collectionData, dbo, api) {
  try{
    const data = api.fetchIexText(collectionData.route).then(data => {
      let collection = dbo.collection(collectionData.name);
      let newestDateInCollectionString = getNewestDateFromCollection(collection);
      let previousNewestDate = new Date(newestDateInCollectionString);
      let newFoundDate = new Date(data);
      if (newFoundDate > previousNewestDate) {
        console.log("Found that " + data + " was more recent than " + newestDateInCollectionString + ", adding new date.");
        collection.insertOne({
          actual: data,
          releaseDate: Date.now()
        }, function(err, res) {
          if (err) throw err;
          console.log("1 document inserted");
        });
      }
    });
  }catch(error){
    console.log(error);
  }
}

function timeSeriesUpdateCall(api) {
  console.log("Scheduled Iex update started at " + Date.now());
  MongoClient.connect(DATA_DB_URL, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DATA_DB_NAME);
    updateTimeSeriesFromIex(unemploymentRateWeekly, dbo, api);
    updateTimeSeriesFromIex(cpiMonthlyCollection, dbo, api);
    updateTimeSeriesFromIex(gdpGrowthQuarterly, dbo, api);
    db.close();
  });
}

function scheduleIexUpdates(api) {
  try {
    schedule.scheduleJob('0 0 * * *', () => {
      timeSeriesUpdateCall(api);
    });
  } catch (err) {
    throw Error(error);
  }
};

async function addDefaultCollections(dbo) {
  return new Promise(async function(resolve, reject) {
    await addCollection(cpiMonthlyCollection, dbo);
    await addCollection(gdpGrowthQuarterly, dbo);
    await addCollection(unemploymentRateWeekly, dbo);
    resolve() // successfully fill promise
  })
}

async function onStart() {
  console.log("Creating mongo server on: " + DATA_DB_URL);
  MongoClient.connect(DATA_DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, async function(err, db) {
    try {
      if (err) throw err;
      let api = apiFetch.IexApi();
      console.log("Connected to mongo database");
      var dbo = db.db(DATA_DB_NAME);
      await addDefaultCollections(dbo);
      scheduleIexUpdates(api);
    } catch (error) {
      throw Error(error);
    } finally {
      db.close();
    }
    let api = apiFetch.IexApi();    //These two lines are for testing purposes, delete them if you don't want an update check on start.
    timeSeriesUpdateCall(api);      //
  });
}
onStart();
