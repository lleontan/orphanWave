//This file handles read/writes from the mysql user database.
//Documentation available at https://github.com/mysqljs/mysql
var mysql = require('mysql2');
var constants = require('../../constants');




class UserDatabase {
  constructor() {
    this.connect();
  }
  connect() {
    this.connection = mysql.createConnection({
      host: '127.0.0.1',
      user: 'root',
      database:'user_db',
      port: "4033",
      password: process.env.USER_DB_PASSWORD_OW
    });
    this.connection.connect(function(err) {
      if (err) {
        console.error('error connecting: ' + err.stack);
        return;
      }
      console.log('connected as id ' + connection.threadId);
    });
  }
  getUserEmailExists(email) {
    //returns true if the user does not exist within the database, and the database is available.
    this.query("Select email from users where `email` = ?", [email], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        return true;
      }
    });
    return false;
  }
  getUser(email) {
    this.query("Select * from users where `email` = ? limit 1", [email], (error, results, fields) => {
      if (error) throw error;
      return getFirstInQuery(results);
    });
    return false;
  }
  getUsernameExists(username) {
    //Returns true if the username is not taken already
    this.query("Select user_name from users where `user_name` = ?", [username], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        return true;
      }
    });
    return false;
  }
  getPasswordHash(email){
    this.query("Select passhash from users where `email` = ? limit 1", [email], (error, results, fields) => {
      if (error) throw error;
      return getFirstInQuery(results);
    });
    return false;
  }
  //uses a callback
  addUser(userData, callback) {
    this.query("insert into users (email, passhash, user_name) VALUES (?, ?, ?))", [userdata.email, userdata.passhash, userdata.username],callback);

  }
  changePasshash(newPasshash) {
    this.query("UPDATE customers SET passhash = ?", [newPasshash], (error, results, fields) => {
      if (error) throw error;

    });
  }
  changeUsername(newUsername) {
    this.query("UPDATE customers SET user_name = ?", [newUsername], (error, results, fields) => {
      if (error) throw error;

    });
  }
  getFirstInQuery(queryResults){
    return queryResults[0];
  }
  getBasicUserData(email){
    this.query("Select username, email from users where `email` = ? limit 1", [email], (error, results, fields) => {
      if (error) throw error;
      return getFirstInQuery(results);
    });
    return false;
  }
  endConnection() {
    this.connection.end(function(err) {
      // The connection is terminated now
    });
  }

  handleDisconnect() {
    /*let sleepDuration = 1000;
    console.log("Attempting user db reconnect", sleepDuration);
    await sleep(sleepDuration);
    connect();*/
  }
}

let userDb = () => {
  return new UserDatabase();
}
module.exports.getInstance = userDb;
module.exports.UserDatabaseClass = UserDatabase;
