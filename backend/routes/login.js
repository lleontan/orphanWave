const router = require('express').Router()
const Auth = require('./authentication/Auth');
const auth = new Auth();
// user posts their email and password We contact Auth.js module to conduct a check with the
// userdatabase if the hashes matches.

router.post('/', (req, res) => {
  let body = req.body;
  if (!(body && body.email && body.password)) {
    console.log("Not all arguments present in login");
    return res.status(400).send({message: "Missing login information"});
  }
  auth.logUserInFull(req, res, body.email,body.password, (err) => {
    if (err) {
      throw err;
    }
    return res.status(200).send({message: "New session initiated"});
  });
})


module.exports = router;
