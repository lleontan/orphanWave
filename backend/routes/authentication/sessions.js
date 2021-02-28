const router = require('express').Router();

//middleware for checking if user is logged in.
router.use('/',(req, res) => {
  //check for a sessionid within req.
  //check if express-session contains that sessionid
  //if that
  console.log("SessionId:"+req.session.sessionId);
  if(req.session.sessionId) {
    // if email key is sent redirect.
    console.log("Valid sessionkey:"+req.session.sessionId);
    next();
  } else {
    return res.status(400).send('invalid auth token'+req.sesion.sessionId);
  }
});

module.exports = router;
