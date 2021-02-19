const router = require('express').Router()

router.post('/', (req, res) => {

    let token = '...'

    return res.status(200).send({token})
})

module.exports = router
