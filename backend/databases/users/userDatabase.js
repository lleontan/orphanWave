// This file handles read/writes from the mysql user database. Documentation available at
// https://github.com/mysqljs/mysql
var mysql = require('mysql2');
var constants = require('../../constants');
const options = {
  host: '127.0.0.1',
  user: 'root',
  database: 'user_db',
  port: "4033",
  password: process.env.USER_DB_PASSWORD_OW
};

//Returns a connection pool object
let connectPool = () => {
  let pool = mysql.createPool(options);

  /*pool.connect(function(err) {
    if (err) {
      throw new Error('error connecting: ' + err.stack);
    } else {
      console.log('connected as id ' + pool.threadId);
    }
  });*/
  return pool;
}

class UserDatabasePool {
  constructor() {
    this.pool = connectPool();
  }

    getUserEmailExists(email,callback) {
      //returns true if the user does not exist within the database, and the database is available.
      this.pool.query(
        "Select email from users where `email` = ?",
        [email],
        (error, results, fields) => {
          if (error)
            throw error;
          if (results.length > 0) {
            callback(true);
          }else{
            callback(false);
          }
        }
      );
    }
    getUser(email,callback) {
      this.pool.query(
        "Select * from users where `email` = ? limit 1",
        [email],
        (error, results, fields) => {
          if (error)
            throw error;
          callback(getFirstInQuery(results));
        }
      );
    }
    getUsernameExists(username,callback) {
      //Returns true if the username is not taken already
      this.pool.query(
        "Select user_name from users where `user_name` = ?",
        [username],
        (error, results, fields) => {
          if (error)
            throw error;
          if (results.length > 0) {
            callback(true);
          }else{
            callback(false);
          }
        }
      );
    }
    getPasswordHash(email,callback) {
      this.pool.query(
        "Select passhash from users where `email` = ? limit 1",
        [email],
        (error, results, fields) => {
          if (error){
            throw error;
          callback(getFirstInQuery(results));
        }
      });
    }
    //uses a callback
    addUser(userData, callback) {
      this.pool.query("insert into users (email, passhash, user_name) VALUES (?, ?, ?)", [
        userData.email, userData.passhash, userData.username
      ], callback);
    }
    changePasshash(newPasshash,callback) {
      this.pool.query(
        "UPDATE customers SET passhash = ?",
        [newPasshash],
        (error, results, fields) => {
          if (error){
            throw error;
          }
          callback(results,fields);
        });
    }
    changeUsername(newUsername,callback) {
      this.pool.query(
        "UPDATE customers SET user_name = ?",
        [newUsername],
        (error, results, fields) => {
          if (error){
            throw error;
          }
          callback(results,fields);
        });
    }
    getFirstInQuery(queryResults) {
      return queryResults[0];
    }
    getBasicUserData(email,callback) {
      this.pool.query(
        "Select username, email from users where `email` = ? limit 1",
        [email],
        (error, results, fields) => {
          if (error){
            throw error;
          callback(getFirstInQuery(results));
        }
      });
    }

    handleDisconnect() {
      /*let sleepDuration = 1000;
      console.log("Attempting user db reconnect", sleepDuration);
      await sleep(sleepDuration);
      connect();*/
    }
}

let makePool = () => {
  return new UserDatabasePool();
}
let defaultInstance=makePool();
module.exports.makePool = makePool;
module.exports.UserDatabasePool = UserDatabasePool;
module.exports.defaultInstance = defaultInstance;
