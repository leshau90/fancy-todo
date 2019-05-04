const router = require('express').Router()
const todo = require(`../controller/todo`)

router.use('/auth', authRouter)
router.use('/todos', todoRouter)

module.exports = router