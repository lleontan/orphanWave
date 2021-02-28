const bcrypt=require("bcrypt");
const UserDb=require("../../databases/users/UserDatabase");
const userDb=UserDb.getInstance();
const saltRounds = 10;          //Do not alter this variable ever!!!

class Auth {
  constructor(){

  }
  newPassHash(email,password){
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err){
          throw err;
        }
        return hash;
    });
  }
  checkMatch(email,password){
    let dbHash=userDb.getPasswordHash(email);
    bcrypt.compare(password, dbHash, function(err, result) {
      if(err){
        throw err;
      }
      return result;
    });
  }
}
let getAuth=()=>{
  return new Auth();
};
module.exports.getAuth = getAuth;
