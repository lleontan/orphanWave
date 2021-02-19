const fetch = require('node-fetch');
const express = require('express');
const api=require("./helpers/apiFetch")
const IexApi=api.IexApi();
const app = express();
const status=require('./routes/status');
const constants= require("./constants");
const loginRouter= require("./routes/login");
const registerRouter= require("./routes/register");

const tokenCheck=require("./helpers/tokenCheck");

const UnemploymentRateString=constants.BASE_IEX_URL+constants.IEX.UNEMPLOYMENT_RATE_ROUTE;
const GENERIC_ERROR_MESSAGE="Error Occured";





var getUnemploymentData=()=>{
  return iexGetRequest(constants.IEX.UNEMPLOYMENT_RATE_DATAPOINTS_ROUTE);
}
app.get(constants.ROUTES.GET_IEX_STATUS,  async (req, res) => {
  status(req,res, IexApi);
});

app.get('/test/unemployment', async (req, res) => {
  let fetchString=UnemploymentRateString+IEX_KEY;
  const data=await getUnemploymentData().then(data => {
      res.send(data);
  });
});
app.get('/',  async (req, res) => {
  res.send("404 page not found");
});

app.use('/login',loginRouter);
app.use('/register',registerRouter);
app.get('/user', tokenCheck, async (req, res) => {
  console.log("User get request initiated");
  res.send("Attempting get on user");
});
app.get('/data', tokenCheck, async (req, res) => {
  console.log("Api data request initiated");
  res.send("Attempting get on data");
});


app.listen(constants.LOCAL_PORT,constants.HOST_NAME, () => {
  console.log('Orphan Wave listening on port '+constants.LOCAL_PORT);
  console.log("http://"+constants.HOST_NAME+':'+constants.LOCAL_PORT+'/');
});
