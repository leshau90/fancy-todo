const router =require('express').Router()
const todoRouter = require('./todo')
const authRouter = require('./auth')


router.use('/auth',authRouter)

router.use('/todos',todoRouter)


module.exports = router