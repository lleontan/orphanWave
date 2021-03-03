const router = require('express').Router()
const Auth=require('./authentication/Auth');
const auth=Auth.getAuth();
//user posts their email and password
//We contact Auth.js module to conduct a check with the userdatabase if the hashes matches.

router.post('/', (req, res) => {
    let body=req.body;
    if(!(body&&body.email&&body.password)){
      return res.status(400).send({
        message:"Missing login information"
      });
    }
    auth.checkMatch(body.email,body.password,(results,error)=>{
      if(error){
        return res.status(400).send({
          message:"Password and username don't match"
        })
      }else{
        //The passwords do match.
        //save the sessionid to the email in reddis;
        req.session.sessionId=body.email;
        req.session.save();
        return res.status(200).send({message:"New session initiated"});
      }
    })
})


module.exports = router;
