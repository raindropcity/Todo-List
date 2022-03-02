const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
  email: {
    type: String
    // required: true
  },
  password: {
    type: String
    // required: true
  },
  userName: {
    type: String
    // required: true
  },
  confirmPassword: {
    type: String
    // required: true 因使用express-validator模組進行使用者輸入內容的驗證，因此於mongoDB的Schema拿掉require: true。否則mongoose也會進行輸入內容驗證
  }
})

module.exports = mongoose.model('User', UserSchema)