const fetch = require('node-fetch');
const constants = require('../constants');
const userDb = require('../databases/users/UserDatabase');

/* This class handles fetch calls to and from external APIs.
 */
class ApiFetchPolygon {
  constructor(baseUrl, authToken) {
    console.log(process.env.PolygonKey);
    if (authToken) {
      this.basePolygonUrl = baseUrl;
      this.authToken = authToken;
    } else {
      console.log('authToken is falsy!!!');
    }
  }

  getKey(args) {
    if (args) {
      return `?${args}&apiKey=${this.authToken}`;
    }
    return `?apiKey=${this.authToken}`;
  }

  getPolygonEndpointNoToken(route) {
    return this.basePolygonUrl + route;
  }

  // This function returns a apiUrl for an PolygonEndpoint from a string
  getPolygonEndpoint(route) {
    return this.basePolygonUrl + route + this.getPolygonKey();
  }

  // Returns a promise for a string Takes the only the endpoint with the token as a string
  fetchPolygonText(endpoint, userToken) {
    let endPoint = this.getPolygonEndpointNoToken(endpoint);
    if (userToken) {
      endPoint = this.getPolygonEndpoint(endpoint);
    }
    return fetch(endPoint).then((fetchResponse) => fetchResponse.text()).then((body) => {
      console.log(`Polygon text returned:${body}`);
      return body;
    });
  }

  fetchGetTickersList(options, callback) {
    const endpoint = '/v2/reference/tickers/';
    const payloadOptions = {};
    payloadOptions.sort = options.sort || '-ticker';
    payloadOptions.type = options.type || 'CS';
    payloadOptions.market = options.market || 'stocks';
    payloadOptions.locale = options.locale || 'us';
    payloadOptions.active = options.active || 'true';
    const queryStr = `${endpoint}?sort=${payloadOptions.sort}?type=${payloadOptions.type}?market=${
      payloadOptions.market}?locale=${payloadOptions.locale}?active=${payloadOptions.active}`;
    this.fetchPolygonJson(queryStr, true).then((jsonObj) => {
      callback(jsonObj);
    }).catch((err) => {
      throw err;
    });
  }

  // Must include limit,type,sort
  fetchGetTickerFinancials(ticker, options, callback) {
    const endpoint = '/v2/reference/financials/';
    options.sort = options.sort || '-reportPeriod';
    options.type = options.type || 'T';
    let queryStr = `${endpoint}?sort=${options.sort}?type=${options.type}`;
    if (options.limit) {
      queryStr = `${queryStr}?limit=${options.limit}`;
    }
    this.fetchPolygonJson(queryStr, true).then((jsonObj) => {
      callback(jsonObj);
    }).catch((err) => {
      throw err;
    });
  }

  // Returns a promise for a object Takes the only the endpoint with the token as a string
  fetchPolygonJson(endpoint, useToken) {
    let endPoint = this.getPolygonEndpointNoToken(endpoint);
    if (useToken) {
      endPoint = this.getPolygonEndpoint(endpoint);
    }

    return fetch(endPoint).then((fetchResponse) => fetchResponse.json()).then((body) => {
      console.log(`Json returned:${body}`);
      return body;
    });
  }

  //Fetches and writes financials to the Db for ONE ticker.
  getWriteFinancials(options, ticker,callback){
    this.fetchGetTickerFinancials(ticker, options, (tickerFinancials) => {
      const resultsArray = tickerFinancials.results;
      userDb.insertTickerFinancialsPolygon(resultsArray, (error, results, fields) => {
        if (error) {
          throw error;
        }
        console.log('Successfully recorded financials for:', ticker);
        callback(error, results, fields));
      });
    });
  };

  //When a user subscribes to a ticker
  addNewUserTickerSubscription(email,ticker,onCompleteCallback){
    //add the subscription to the users profile in `userSubscriptions` table
    userDb.insertUserTickerSubscription(email,ticker,()=>{
      onCompleteCallback();
    });
  }
  fetchGetDailyOpenCloseAllTickers(options, callback) {
    const endpoint = '/v2/aggs/grouped/locale/us/market/stocks/';
    const queryStr = `${endpoint}?date=${options.date}?unadjusted=${options.unadjusted}`;
    this.fetchPolygonJson(queryStr, true).then((jsonObj) => {
      callback(jsonObj);
    }).catch((err) => {
      throw err;
    });
  }
}

const polygonApi = () => new ApiFetchPolygon(constants.BASE_POLYGON_URL, process.env.polygonApi);

module.exports.PolygonApi = polygonApi;
module.exports.ApiFetchPolygon = ApiFetchPolygon;
