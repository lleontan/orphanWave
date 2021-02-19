//This file handles read/writes from the mysql user database.
//Documentation available at https://github.com/mysqljs/mysql
var mysql = require('mysql');
var constants = require('../../constants');




class UserDatabase {
  constructor() {
    this.query = (queryString, valuesArray, callback) => {
      //Private query
      //An arguments example:
      //connection.query('SELECT * FROM `books` WHERE `author` = ?', ['David'], function (error, results, fields)
      if (this.connection) {
        this.connection.query(queryString, valuesArray, callback);
      } else {
        throw new Error(constants.USER_DATABASE.NO_CLIENT_CONNECTION);
      }
    }
  }
  connect() {
    this.connection = mysql.createConnection({
      host: 'localhost',
      user: 'userDatabaseDriver',
      port: constants.USER_DATABASE.DEFAULT_USER_DB_PORT,
      password: process.env.USER_DATABASE_PASSWORD
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
  getUsernameExists(username) {
    //Returns true if the username is not taken already
    this.query("Select user_name from users where `email` = ?", [email], (error, results, fields) => {
      if (error) throw error;
      if (results.length > 0) {
        return true;
      }
    });
    return false;
  }
  addUser(userData) {
    this.query("insert into users (email, passhash, user_name) VALUES (?, ?, ?))", [userdata.email, userdata.passhash, userdata.username], (error, results, fields) => {
      if (error) throw error;

    });
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
module.export = UserDatabase;
