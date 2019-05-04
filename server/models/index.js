const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// const { givesError } = require('../helpers')
mongoose.connect((process.env.MONGOOSE_CONNECT || 'mongodb://localhost:27017/test'), { useNewUrlParser: true });
const Schema = mongoose.Schema

// emailValidators = [{ validator: isEmail, msg: 'please supply a valid email' }, { validator: uniqueEmail, msg: 'email already in use' }]

let todoSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }]
})

let tagSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,
    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }]
})

let userSchema = new Schema({
    username: String,
    email: {
        type: String, match: [/\w+@\w+\.\w+/, 'please supply a valid email format'],
        validate: [{
            validator: async function (val) {
                let already = await Member.findOne({ _id: { $ne: this._id }, email: val })
                return already == null
            }, msg: 'email already in use'
        }]
    },
    password: { type: String, select: false },
    image: String,

    inviteFriends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    toBeAcceptedFriends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

let projectSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    isbn: String,
    title: String,
    author: String,
    category: String,
    stock: Number,
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    todo: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})


userSchema.pre('save', function () {
    if (this.isModified('password')) { this.password = bcrypt.hashSync(this.password)}
})

userSchema.methods.comparePassword = function (str) {
    return bcrypt.compareSync(str, this.password)
}
let User = mongoose.model('User', userSchema)
let Project = mongoose.model('Project', projectSchema)
let Todo = mongoose.model('Todo', todoSchema)
let Tag = mongoose.model('Tag', tagSchema)

module.exports = { User, Todo, Project, Tag }

