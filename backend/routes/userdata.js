const router = require('express').Router()

const Auth = require('./authentication/Auth');
const auth = new Auth();
const UserDatabase = require("../databases/users/userDatabase");
//returns json obj of the currently logged in users email and username username:str email:str
const userdata = router.get('/', (req, res) => {
  console.log("Session println:",req.session);
  if (req.session.email) {
    let userDb = UserDatabase.defaultInstance;
    userDb.getUserEmailExists(req.session.email, (emailExists) => {
      if(emailExists){
      userDb.getBasicUserData(req.session.email,(error, results, fields)=>{
        console.log("Attempting login data send:",results);
          res.status(200).send({user:results});
      });
    }else{
      return res.status(400).send({message: "Invalid session identifier"});
    }
    });
  }else{
    return res.status(400).send({message: "No session identifier"});
  }
})

module.exports = userdata;
