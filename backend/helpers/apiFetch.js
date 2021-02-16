const fetch = require('node-fetch');
let constants = require('../constants');

/* This class handles fetch calls to and from external APIs.
 */
class ApiFetch {

  constructor(baseUrl, authToken) {
    console.log(process.env.iexKey);
    if (authToken) {
      this.baseIexUrl = baseUrl;
      this.authToken = authToken;

    } else {
      console.log("authToken is falsy!!!");
    }
  }
  getIexKey(args) {
    if (args) {
      return "?" + args + "&token=" + this.authToken;
    } else {
      return "?token=" + this.authToken;
    }
  }

  getIexEndpointNoToken(route) {
    return this.baseIexUrl + route;
  }
  //This function returns a apiUrl for an IexEndpoint from a string
  getIexEndpoint(route) {
    return this.baseIexUrl + route + this.getIexKey();
  }

  //TODO: If transformations are done to params alter this function to preform them here.
  iexGetRequest(endpoint, params) {
    return fetchIex(endpoint);
  }

  //Returns a promise for a string
  //Takes the only the endpoint with the token as a string
  fetchIexText(endpoint,userToken) {
    let endPoint = this.getIexEndpointNoToken(endpoint);
    if (useToken) {
      endPoint = this.getIexEndpoint(endpoint);
    }
    return fetch(endPoint)
      .then((fetchResponse) => {
        return fetchResponse.text();
      })
      .then(body => {
        console.log("Iex text returned:" + body);
        return body;
      })
  }

  //Returns a promise for a object
  //Takes the only the endpoint with the token as a string
  fetchIexJson(endpoint, useToken) {
    let endPoint = this.getIexEndpointNoToken(endpoint);
    if (useToken) {
      endPoint = this.getIexEndpoint(endpoint);
    }

    return fetch(endPoint)
      .then((fetchResponse) => {
        return fetchResponse.json();
      })
      .then(body => {
        console.log("Iex json returned:" + body);
        return body;
      });
  }
}

let iexApi = () => {
  return new ApiFetch(constants.BASE_IEX_URL, process.env.iexKey);
}
module.exports.IexApi = iexApi;
module.exports.ApiFetch = ApiFetch;
