const router = require('express').Router()
const auth = require(`../controller/auth`)

router.use('/auth', authRouter)
router.use('/todos', todoRouter)

module.exports = router