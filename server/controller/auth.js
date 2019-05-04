const { OAuth2Client } = require('google-auth-library')
const UserModel = require('../models/User')
const { wrapAsync, givesError, jwtGiveToken, jwtVerifyToken, generateStringOfNumber } = require('../helpers')
const { User } = require('../models')
const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

// User.findOne({_id:req.body._id}).select('+password')
const functions = {
    register: wrapAsync((req, res) => {
        let user = await User.create({
            name: req.body.name, email: req.body.email, password: req.body.password
        })
        if (user) {
            let { _id, name, email } = user
            res.status(201).json({ user: { _id, name, email } })
        } else throw givesError(404, 'user cannot be created')
    }),

    login: wrapAsync((req, res) => {
        let user = await User.findOne({ email: req.body.email }).select('+password')
        if (user && user.comparePassword(req.body.password)) {
            delete user.password;
            let token = jwtGiveToken(user)
            res.status(201).json({ user, token })
        }
        else throw givesError(404, 'user cannot be created')
    }),

    googleSignin: wrapAsync((req, res) => {
        // console.log(process.env.GOOGLE_CLIENT_ID)   
        
        let ticket = await googleClient.verifyIdToken({
            idToken: req.body.token,
            audience: process.env.GOOGLE_CLIENT_ID
        })

        if (ticket) {
            let { email, name } = ticket.getPayload()
            let user = await User.findOne({ email })
            if (!user) { user = UserModel.create({ password: generateStringOfNumber(8), email, name }) }
            let jwt_token = jwtGiveToken(user)
            res.status(201).json({
                user: { _id: user._id, name: user.name, email: user.email, },
                token: jwt_token
            })
        } else throw givesError(404, 'have you supplied the right google credentials')
    }),
}


module.exports = functions
