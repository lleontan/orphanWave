const bcrypt = require("bcrypt");

const UserDatabase = require("../../databases/users/userDatabase");

const saltRounds = 10; //Do not alter this variable ever!!!

//logs users in without a password check. Do not export.
const logUserIn = (req, res, email, callback) => {
  req.session.email = email;
  res.header('Access-Control-Allow-Credentials', true);
  res.header('Access-Control-Allow-Headers', "Accept");

  req.session.save(callback);
}
class Auth {
  constructor() {
    this.userDb = UserDatabase.defaultInstance;
  }

  //logs users in requiring a password check. Callback uses the req.save arguments
  logUserInFull(req, res, email, password, callback) {
    this.userDb.getUserEmailExists(email, (emailExists) => {
      if (emailExists) {
        this.checkMatch(email, password, (result, err) => {
          if (err) {
            console.log("Login error:", err);
            return res.status(400).send({message: "Invalid Password"});
          }
          if (result) {
            logUserIn(req, res, email, callback);
          } else {
            return res.status(400).send({message: "Invalid Password"});
          }
        });
      } else {
        return res.status(400).send({message: "Invalid email"});
      }
    })
  };

  newPassHash(email, password, callback) {
    bcrypt.hash(password, saltRounds, function(err, hash) {
      if (err) {
        throw err;
      }
      callback(hash);
    });
  }
  checkMatch(email, password, callback) {
    console.log("attempting hash start");
    this.userDb.getPasswordHash(email, (error, passwordHash) => {
      if (error) {
        callback(result, error);
      } else {
        let hashVal = passwordHash.passhash;
        console.log("attempting hash:", hashVal);
        bcrypt.compare(password, hashVal, (err, result) => {
          console.log("Comparison:", err, ":", result);
          callback(result, err);
        });
      }
    });
  }
}
module.exports = Auth;
