var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";



MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("orphanWaveIndicators");
  dbo.createCollection("us_cpi_monthly", function(err, res) {
    if (err) throw err;
    console.log("Mongo cpi_weekly collection created!");
    //db.close();
  });
  dbo.createCollection("gdp_growth_quarterly", function(err, res) {
    if (err) throw err;
    console.log("Mongo us_gdp_monthly collection created!");
  });
});
