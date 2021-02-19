/*
  A post on this route will preform a check on the user database for existance of conflicting email.
  If the password, email, and username are valid. Make a new entry in the database for the new user.
  Utilize the userDatabase module for read/writes.
*/
const userDb=require("../databases/users/userDatabase");
const router = require('express').Router()

router.post('/', (req, res) => {

    let token = '...'

    return res.status(200).send({token})
})

module.exports = router
