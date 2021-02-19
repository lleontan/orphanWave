let constants = require('../../constants');

var MongoClient = require('mongodb').MongoClient;
var url = constants.DATA_DB_URL;
const DB_NAME=constants.DATA_DB_NAME;
const dummyGdpGrowthQuarterly = [
  { actual: 1.1, releaseDate: new Date("2019-03-18"), note:"Actual Value"},
  { actual: 3.1, releaseDate: new Date("2019-06-18"), note:"Actual Value"},
  { actual: 2, releaseDate: new Date("2019-09-18"), note:"Actual Value"},
  { actual: 2.1, releaseDate: new Date("2019-12-20"), note:"Actual Value"},
  { actual: 2.1, releaseDate: new Date("2020-03-26"), note:"Actual Value"}
];
const dummyCpiInflationRateMonthly = [
    { actual: 2.3, releaseDate: new Date("2019-12-11"), note:"Actual Value"},
    { actual: 2.3, releaseDate: new Date("2020-01-14"), note:"Actual Value"},
    { actual: 2.3, releaseDate: new Date("2020-02-13	"), note:"Actual Value"},
    { actual: 2.4, releaseDate: new Date("2020-03-11"), note:"Actual Value"}
];
const dummyUnemploymentRateWeekly = [
    { actual: 2.3, releaseDate: new Date("2019-12-11"), note:"Dummy Value"},
    { actual: 2.3, releaseDate: new Date("2020-01-14"), note:"Dummy Value"},
    { actual: 2.3, releaseDate: new Date("2020-02-13	"), note:"Dummy Value"},
    { actual: 2.4, releaseDate: new Date("2020-03-11"), note:"Dummy Value"}
];
function insertDummyGdpGrowthQuarterly(){
  insertDummyData("gdp_growth_quarterly",dummyGdpGrowthQuarterly,true);
}
function insertDummyCpiInflationRateMonthly(){
  insertDummyData("us_cpi_monthly",dummyCpiInflationRateMonthly,true);
}
function insertDummyUnemploymentRateWeekly(){
  insertDummyData("unemployment_rate_weekly",dummyUnemploymentRateWeekly,true);
}
function insertDummyData(collectionName,newData,dropOldData){
  console.log("Mongo url is "+url);
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db(DB_NAME);
    let collection = dbo.collection(collectionName);
    console.log("Inserting "+newData.length+" datapoints to "+collectionName);
    if(dropOldData){
      console.log("Preexisting data dropped before insert");
      collection.drop();
    }
    collection.insertMany(newData, function(err, res) {
      if (err) throw err;
      console.log("Number of documents inserted to "+collectionName+": " + res.insertedCount);
      collection.countDocuments().then((count) => {
          console.log("New count is "+count);
          db.close();
      });
    });
  });
}

function onStart(){
  console.log("Populating mongo db with default data. Most dummy data is real though.");
  insertDummyGdpGrowthQuarterly();
  insertDummyCpiInflationRateMonthly();
  insertDummyUnemploymentRateWeekly();
}
onStart();
