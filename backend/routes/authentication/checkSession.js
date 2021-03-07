const router = require('express').Router();

//middleware for checking if user is logged in but doesn't feed them along to the next router.
router.use('/',(req, res) => {
  console.log("SessionId check:"+req.session.email);
  if(req.session.email) {
    return res.status(200).send({message: "You're logged in"});
  } else {
    return res.status(400).send('Invalid session');
  }
});

module.exports = router;
