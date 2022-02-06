const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  userName: {
    type: String,
    required: true
  },
  comfirmPassword: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('User', UserSchema)