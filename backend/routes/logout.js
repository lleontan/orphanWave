const router = require('express').Router()

const Auth = require('./authentication/Auth');
const auth = new Auth();
router.post('/', (req, res) => {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
      return res.status(400).send("Cannot log out");
    }
    return res.status(200).send({message:'Logged Out'});
  });
})

module.exports = router;
