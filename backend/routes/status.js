const constants = require("../constants");
module.exports =
  (req, res, api) => {
    let checkURL = constants.IEX.STATUS_ROUTE;
    console.log("attempting IEX check " + checkURL);

    api.fetchIexJson(checkURL)
      .catch(error => {
        console.log("Iex status check error\n"+error);
      })
      .then(body => {
        console.log("Iex json returned:" + body);
        res.send(body);
      });
  };
