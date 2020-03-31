var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("orphanWaveIndicators");
  var dummyGdpGrowthQuarterly = [
    { actual: 1.1, release_date: new Date("2019-03-18"), note:"Actual Value"},
    { actual: 3.1, release_date: new Date("2019-06-18"), note:"Actual Value"},
    { actual: 2, release_date: new Date("2019-09-18"), note:"Actual Value"},
    { actual: 2.1, release_date: new Date("2019-12-20"), note:"Actual Value"},
    { actual: 2.1, release_date: new Date("2020-03-26"), note:"Actual Value"}
  ];
  var dummyCpiInflationRateMonthly = [
      { actual: 2.3, release_date: new Date("2019-12-11"), note:"Dummy Value"},
      { actual: 2.3, release_date: new Date("2020-01-14"), note:"Dummy Value"},
      { actual: 2.3, release_date: new Date("2020-02-13	"), note:"Dummy Value"},
      { actual: 2.4, release_date: new Date("2020-03-11"), note:"Dummy Value"}
  ];
  dbo.collection("gdp_growth_quarterly").insertMany(dummyGdpGrowthQuarterly, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
  dbo.collection("us_cpi_monthly").insertMany(dummyCpiInflationRateMonthly, function(err, res) {
    if (err) throw err;
    console.log("Number of documents inserted: " + res.insertedCount);
    db.close();
  });
});
