require('dotenv').config()
const express = require('express');
const app = express();
const routers = require('./router')
const cors = require('cors')
const volleyball = require('volleyball')
const port = process.env.PORT || 3000

app.use(cors())
app.use(volleyball)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use('/', routers);


app.use(function (error, req, res, next) {
    console.log('vvvvvvv caught by last error middlware vvvvvvvv')
    if (error.fromRoute) console.log(error.fromRoute)
    console.log(error)
    if (error.name === 'ValidationError') { error.statusCode = 404; error.message = 'check your input' }
    // console.log(error.name)
    // console.log(error.message)
    // console.log(error.errors)
    console.log('^^^^^ERROR^^^^^')
    if (!error.statusCode) error.statusCode = 500
    console.log('error status code: ', error.statusCode)
    res.status(error.statusCode).json({ message: error.message, error });
});

app.listen(port, () => console.log(`listening on port ${port}`));

