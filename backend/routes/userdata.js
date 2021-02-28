const router = require('express').Router()
const Auth=require('./authentication/Auth');
const auth=Auth.getAuth();
const UserDatabase=require("../databases/users/userDatabase");
const userDb=UserDatabase.getInstance();
//returns json obj of the currently logged in users email and username
//username:str
//email:str
const userdata=router.get('/', (req, res) => {
    if(req.session.sessionId){
      let queryResults=userDb.getBasicUserData(req.session.sessionId);
      res.status(200).send(queryResults);
    }else{
      let token = 'basicUserDataGetError'
      return res.status(400).send(token);
    }
})

module.exports = userdata;
