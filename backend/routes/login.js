const router = require('express').Router()
const Auth=require('./authentication/Auth');
const auth=Auth.getAuth();
//user posts their email and password
//We contact Auth.js module to conduct a check with the userdatabase if the hashes matches.

router.post('/', (req, res) => {
    let body=req.body;
    if(!(body&&body.email&&body.password)){
      return res.status(400).send('Invalid body');
    }
    auth.checkPasswordMatch(body.email,body.password).then((results,error)=>{
      if(error){
        return res.status(400).send("Password don't match")
      }else{
        //The passwords do match.
        //save the sessionid to the email in reddis;
        req.session.sessionId=body.email;
        return res.status(200).send({message:"New session initiated"});
      }
    })

    let token = 'Done'

    return res.status(200).send(token);
})

module.exports = router;
