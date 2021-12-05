const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 把想要的資料結構當成參數傳給 new Schema()
const todoSchema = new Schema({
  name: {
    type: String,
    required: true
  }
})

// 匯出的時候把這份 schema 命名為 Todo，以後在其他的檔案直接使用 Todo 就可以操作和「待辦事項」有關的資料了
module.exports = mongoose.model('Todo', todoSchema)