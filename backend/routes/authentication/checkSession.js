const router = require('express').Router();

//middleware for checking if user is logged in.
router.use('/',(req, res) => {
  //check for a sessionid within req.
  //check if express-session contains that sessionid
  //if that
  console.log("SessionId check:"+req.session.sessionId);
  if(req.session.sessionId) {
    return res.status(200).send({message: "You're logged in"});
  } else {
    return res.status(400).send('Invalid session');
  }
});

module.exports = router;
