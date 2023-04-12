const mongoose = require('mongoose')

const UserSchema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
    },
    password: {
        type: String
    },
    role: {
        type: String
    },
    path: {
        type: String
    },
},
{
    collection: 'Users'
})

const UserModel = new mongoose.model('User', UserSchema)

module.exports = UserModel