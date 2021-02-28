/*
  A post on this route will preform a check on the user database for existance of conflicting email.
  If the password, email, and username are valid. Make a new entry in the database for the new user.
  Utilize the userDatabase module for read/writes.
*/

const Auth=require('./authentication/Auth');
const auth=Auth.getAuth();
const UserDatabase=require("../databases/users/userDatabase");
const userDb=UserDatabase.getInstance();
const router = require('express').Router();
const slurContains=require("./../helpers/slurContains");
const login=require("./login");

router.post("/",(req, res) => {
    let body=req.body;
    let emailRegex=/^[a-zA-Z0-9_\-]+@[a-zA-Z0-9]+\.com$/;
    let validPasswordRegex=/^.{1,}$/;
    console.log("attempting add new user:",body);

    if(!body.email){
      return res.status(400).send('No email');
    }
    if(userDb.getUserEmailExists(body.email)){
      return res.status(400).send('Email Already Exists');
    }
    if(!emailRegex.test(body.email)){
      return res.status(400).send('Invalid email');
    }
    if(!body.password){
      return res.status(400).send('No Password');
    }
    if(!validPasswordRegex.test(body.password)){
      return res.status(400).send('Invalid password');
    }
    if(body.password!=body.confirmPassword){
      return res.status(400).send('Password and confirmation not matching');
    }
    if(body.username&&body.username.length>minUserLength&&!slurContains(body.username)){

    }else{
      return res.status(400).send('Invalid username');
    }
    let newUserSchema={
      email:body.email,
      passhash:newPassHash(body.email,body.password),
      username:body.username
    };

    userDb.addUser(newUserSchema,(results,error,fields)=>{
      if(error){
        return res.status(400).send('Invalid username');
      }
      console.log("New user should be added:");
      return res.status(200).send({message: "User creation success "+body.email});
    });

    //return res.status(200).send({message: "User creation success "+body.email});
})

module.exports = router;
