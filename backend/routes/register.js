/*
  A post on this route will preform a check on the user database for existance of conflicting email.
  If the password, email, and username are valid. Make a new entry in the database for the new user.
  Utilize the userDatabase module for read/writes.
*/

const Auth = require('./authentication/Auth');
const auth = new Auth();
const UserDatabase = require("../databases/users/userDatabase");
const router = require('express').Router();
const slurContains = require("./../helpers/slurContains");
const login = require("./login");
const constants = require("../constants");
router.post("/", (req, res) => {
  let body = req.body;
  let emailRegex = /^[a-zA-Z0-9_\-]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]+$/;
  let validPasswordRegex = /^.{1,200}$/;
  let userDb = UserDatabase.defaultInstance;

  if (!body.email) {
    return res.status(400).send('No email');
  }
  userDb.getUserEmailExists(body.email, (emailExists) => {
    if (emailExists) {
      console.log("Duplicate email add attempted", body.email);
      res.status(409).send({
        message:"Duplicate email add attempted"
      });
      return;
      console.log("Sanity check");
    } else {
      if (!emailRegex.test(body.email)) {
        return res.status(400).send({
          message:"Invalid Email"
        });
      }
      if (!body.password) {
        return res.status(400).send({
          message:"No password"
        });
      }
      if (!validPasswordRegex.test(body.password)) {
        return res.status(403).send({
          message:"Invalid password"
        });
      }
      if (body.password != body.confirmPassword) {
        return res.status(423).send({
          message:"Password and confirmation not matching"
        });
      }
      if (body.username && body.username.length > constants.USER_DATABASE.MIN_USERNAME_LENGTH && !slurContains(body.username)) {
        userDb.getUsernameExists(body.username, (usernameExists)=> {
          if (!usernameExists) {
            auth.newPassHash(body.email, body.password, (newPassHash) => {
              let newUserSchema = {
                email: body.email,
                passhash: newPassHash,
                username: body.username
              };

              userDb.addUser(newUserSchema, (error, results, fields) => {

                if (error) {
                  console.log(error);
                  return res.status(500).send({
                    message:"Internal server error"
                  });
                }
                console.log("New user should be added:", results);
                //console.log(req.session)
                req.session.email=body.email;
                req.session.save((err) => {
                  if(err){
                    console.log(err);
                  }
                  console.log(req.session);
                  res.status(200).send({
                    message: "User creation success " + body.email
                  });
                  res.end();
                });
                //console.log(req.session)

              });
            })
          }else{
            return res.status(422).send({
              message:"Duplicate username"
            });
          }
        });
      } else {
        return res.status(400).send({
          message:"Invalid username"
        });
      }

    }
  })

  //return res.status(200).send({message: "User creation success "+body.email});
})

module.exports = router;
