// 建立種子資料：準備一些基本資料，這種預先配置好的資料稱為「種子資料(seed data)」。
// 因此這個檔案叫做todoSeeder.js
const mongoose = require('mongoose')
const db = mongoose.connection
const Todo = require('../todo')

mongoose.connect('mongodb://localhost/todo_list', { useNewUrlParser: true, useUnifiedTopology: true })

db.on('error', () => {
  console.log('mongodb error')
})

db.once('open', () => {
  console.log('mongodb connected')

  for (let i = 0; i < 10; i++) {
    // Todo.create() 是 Mongoose 提供的資料操作方法，之前我們建立了一個叫 Todo 的 model 物件(見todo.js的module.exports)。
    // 使用 Todo.create() 產生資料時，你需要告訴 Todo model 資料內容是什麼，這邊按照了之前在 Todo 的 schema 裡定義的規格。
    Todo.create({ name: `name-${i}` })
  }

  console.log('done.')
})
