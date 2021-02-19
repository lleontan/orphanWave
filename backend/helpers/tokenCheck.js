/*This file checks for the existance of a matching token to logged in email.*/
const tokenCheck=(req, res, next)=>{
  var token = req.headers['access-token'];
  console.log("Attempting token check");
  if (token) {
        // validate token
        next();
    }
    else {
      return res.status(403).send({
            success: false,
            message: 'Missing Authentication Token'
        });
    }
}
module.exports = tokenCheck;
