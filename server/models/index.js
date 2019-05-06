const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
// const { givesError } = require('../helpers')
mongoose.connect((process.env.MONGOOSE_CONNECT || 'mongodb://localhost:27017/test'), { useNewUrlParser: true });
const Schema = mongoose.Schema

// emailValidators = [{ validator: isEmail, msg: 'please supply a valid email' }, { validator: uniqueEmail, msg: 'email already in use' }]

let todoSchema = new Schema({
    //name, description, status, due date
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    description: String,
    // link: String,
    status: String,
    due_date: Date,
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    project: { type: Schema.Types.ObjectId, ref: 'Project' }
})

let tagSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    title: String,

    projects: [{ type: Schema.Types.ObjectId, ref: 'Project' }],
    users: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    todos: [{ type: Schema.Types.ObjectId, ref: 'Todo' }]
})

let userSchema = new Schema({
    name: { type: String, required: true },    
    email: {
        type: String, match: [/\w+@\w+\.\w+/, 'please supply a valid email format'],
        required:true,
        validate: [{
            validator: async function (val) {
                let already = await User.findOne({ _id: { $ne: this._id }, email: val })                
                return already == null
            }, msg: 'email already in use'
        }]
    },
    password: { type: String, select: false, required:true },
    image: String,

    requestFriend: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    pendingFriend: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    rejectedFriend: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    friends: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    tags: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

let projectSchema = new Schema({
    creator: { type: Schema.Types.ObjectId, ref: 'User' },
    name: String,
    tags: [{ type: Schema.Types.ObjectId, ref: 'Tag' }],
    participants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    invitedParticipants: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    todos: [{ type: Schema.Types.ObjectId, ref: 'User' }]
})

//synchronous
userSchema.pre('save', function () {
    if (this.isModified('password')) { this.password = bcrypt.hashSync(this.password, 6) }
})

userSchema.methods.comparePassword = function (str) {
    return bcrypt.compareSync(str, this.password)
}
let User = mongoose.model('User', userSchema)
let Project = mongoose.model('Project', projectSchema)
let Todo = mongoose.model('Todo', todoSchema)
let Tag = mongoose.model('Tag', tagSchema)

module.exports = { User, Todo, Project, Tag }

