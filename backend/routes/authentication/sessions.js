const router = require('express').Router();

//middleware for checking if user is logged in.
router.use('/',(req, res,next) => {
  //check for a sessionid within req.
  //check if express-session contains that sessionid
  //if that
  console.log("SessionId:"+req.session.email);
  if(req.session.email) {
    // if email key is sent redirect.
    console.log("Valid sessionkey:"+req.session.email);
    next();
  } else {
    return res.status(401).send({message:'invalid auth token'+req.sesion.email});
  }
});

module.exports = router;
