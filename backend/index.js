const fetch = require('node-fetch');
const express = require('express');
const api = require("./helpers/apiFetch")
const IexApi = api.IexApi();
const app = express();
const status = require('./routes/status');
const constants = require("./constants");
const loginRouter = require("./routes/login");
const logoutRouter = require("./routes/logout");
const sessionRouter = require("./routes/authentication/sessions");   //session router is used for mandatory session validation
const checkSessionRouter = require("./routes/authentication/checkSession");   //for a manual check
const userdataRouter = require("./routes/userdata");   //for a manual check

const registerRouter = require("./routes/register");
const cors = require("cors");
var cookieParser = require('cookie-parser');
var session = require('express-session');
let redis=require("redis");
let RedisStore = require('connect-redis')(session)
let redisClient = redis.createClient()

const UnemploymentRateString = constants.BASE_IEX_URL + constants.IEX.UNEMPLOYMENT_RATE_ROUTE;
const GENERIC_ERROR_MESSAGE = "Error Occured";

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

let port = normalizePort(process.env.LOCAL_PORT || '9000');
if (app.get('env') === 'production') {
  app.set('trust proxy', 1) // trust first proxy
  sess.cookie.secure = true // serve secure cookies
}
let sessionHandler = session({
  secret: process.env.sessionSecret,
  resave: false,
  expires: new Date(Date.now() + (30 * 86400 * 1000)),
  store: new RedisStore({client: redisClient}),
  saveUninitialized: false
});

app.use(cookieParser(process.env.sessionSecret));
app.use(sessionHandler);

app.use(cors());
app.use(express.json())
app.set('port', port);
app.get(constants.ROUTES.GET_IEX_STATUS, async (req, res) => {
  status(req, res, IexApi);
});
// This middleware will check if user's cookie is still saved in browser and user is not set,
// then automatically log the user out. This usually happens when you stop your express server
// after login, your cookie still remains saved in the browser.
/*app.use((req, res, next) => {
  /*if (!req.session.sessionId) {
  //  res.clearCookie('sessionId');
}
  next();
});*/
app.use((req, res, next) => {
  console.log("req:"+req.originalUrl);
  return next();
});
app.get('/test/unemployment', async (req, res) => {
  let fetchString = UnemploymentRateString + IEX_KEY;
  const data = await IexApi.iexGetRequest(constants.IEX.UNEMPLOYMENT_RATE_DATAPOINTS_ROUTE).then(
    data => {
      res.send(data);
    }
  );
});
/*app.get('/', async (req, res) => {
  res.send("404 page not found");
});*/
app.use('/login', loginRouter);
app.use('/logout', logoutRouter);
app.use('/checkSession', checkSessionRouter);
app.use('/userdata', userdataRouter);

app.use('/register', registerRouter);
app.get('user', sessionRouter, async (req, res) => {
  console.log("User get request initiated");
  res.send("Attempting get on user");
});
app.get('data', sessionRouter, async (req, res) => {
  console.log("Api data request initiated");
  res.send("Attempting get on data");
});

app.listen(constants.LOCAL_PORT, constants.HOST_NAME, () => {
  console.log('Orphan Wave listening on port ' + constants.LOCAL_PORT);
  console.log("http://" + constants.HOST_NAME + ':' + constants.LOCAL_PORT + '/');
});
