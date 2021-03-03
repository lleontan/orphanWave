const router = require('express').Router()
const Auth = require('./authentication/Auth');
const auth = Auth.getAuth();
const UserDatabase = require("../databases/users/userDatabase");
//returns json obj of the currently logged in users email and username username:str email:str
const userdata = router.get('/', (req, res) => {
  console.log("Session println:",req.session);
  if (req.session.sessionId) {
    let userDb = UserDatabase.defaultInstance;
    userDb.getBasicUserData(req.session.sessionId,(queryResults)=>{
        res.status(200).send(queryResults);
    });
  }
})

module.exports = userdata;
