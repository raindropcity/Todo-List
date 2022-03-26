const mongoose = require('mongoose')
const Schema = mongoose.Schema

// 把想要的資料結構當成參數傳給 new Schema()
// 確立資料的最小單位，也就是所謂「一筆資料」長的像下面的樣子。而在MongoDB中「一筆資料」叫做model
// 確保每一筆 todo 資料都會長得是這個樣子。也就是透過mongoose.Schema去定義一筆資料中會包含哪些東西
const todoSchema = new Schema({
  agendas: {
    type: String,
  },
  content: {
    type: String,
  },
  isDone: {
    type: Boolean,
    default: false
  }
})

// 匯出的時候把這份 schema 命名為 Todo，以後在其他的檔案直接使用 Todo 就可以操作和「待辦事項」有關的資料了
module.exports = mongoose.model('Todo', todoSchema)