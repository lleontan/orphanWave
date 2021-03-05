const bcrypt=require("bcrypt");

const UserDatabase=require("../../databases/users/userDatabase");

const saltRounds = 10;          //Do not alter this variable ever!!!

class Auth {
  constructor(){
    this.userDb=UserDatabase.defaultInstance;
  }
  newPassHash(email,password,callback){
    bcrypt.hash(password, saltRounds, function(err, hash) {
        if(err){
          throw err;
        }
        callback(hash);
    });
  }
  checkMatch(email,password,callback){
    console.log("attempting hash start");
    this.userDb.getPasswordHash(email,(passwordHash)=>{
      console.log("attempting hash");
      bcrypt.compare(password, passwordHash, function(err, result) {
        /*if(err){
          throw err;
        }*/
        console.log("Comparison");
        callback(result,err);
      });
    });
  }
}
module.exports=Auth;
