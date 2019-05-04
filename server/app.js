require('dotenv').config()
const express = require('express');
const app = express();
const router = express.Router()
const cors = require('cors')
const volleyball = require('volleyball')
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: false }))

// app.use
app.use(cors())
app.use(volleyball)
app.use('/', router);


app.use(function (error, req, res, next) {
    console.log('~~~caught by last error middlware~~~')
    if (error.fromRoute) console.log(error.fromRoute)
    console.log(error)
    console.log('~~~~~~')
    if (!error.statusCode) error.statusCode = 500
    res.status(error.statusCode).json({ message: error.message, error });
});

app.listen(port, () => console.log(`listening on port ${port}`));

