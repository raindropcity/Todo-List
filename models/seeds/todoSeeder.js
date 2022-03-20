// 建立種子資料：準備一些基本資料，這種預先配置好的資料稱為「種子資料(seed data)」。
// 因此這個檔案叫做todoSeeder.js

// 這邊是原本的寫法。 因為後續將Mongoose連線設定獨立出來寫在/config/mongoose.js中，因此這邊有很多程式碼可以省略。見下面。
// const mongoose = require('mongoose')
// const db = mongoose.connection
// const Todo = require('../todo')

// mongoose.connect('mongodb://localhost/todo_list', { useNewUrlParser: true, useUnifiedTopology: true })

// db.on('error', () => {
//   console.log('mongodb error')
// })

// db.once('open', () => {
//   console.log('mongodb connected')

//   for (let i = 0; i < 10; i++) {
//     // Todo.create() 是 Mongoose 提供的資料操作方法，之前我們建立了一個叫 Todo 的 model 物件(見todo.js的module.exports)。
//     // 使用 Todo.create() 產生資料時，你需要告訴 Todo model 資料內容是什麼，這邊按照了之前在 Todo 的 schema 裡定義的規格。
//     Todo.create({ name: `name-${i}` })
//   }

//   console.log('done.')
// })

// 引用/config/mongoose.js後的寫法
// 在/config/mongoose.js中有寫好的東西，在這邊直接引用就行，不用再寫(跟上面對照，哪些程式碼省略、哪些不能省略)。
// 因為todoSeeder.js是為了先建立一組種子資料存入資料庫，因此Mongoose連線成功的執行區域中有寫個create()來生成種子資料。也就是這部分跟/config/mongoose.js所寫內容不同，不可以省略。
const db = require('../../config/mongoose')
const Todo = require('../todo')

db.once('open', () => {
    // Todo.create() 是 Mongoose 提供的資料操作方法，之前我們建立了一個叫 Todo 的 model 物件(見todo.js的module.exports)。
    // 使用 Todo.create() 產生資料時，你需要告訴 Todo model 資料內容是什麼，這邊按照了之前在 Todo 的 schema 裡定義的規格。
    Todo.create({
      agendas: 'keep positive',
      content: 'feeling pain, feeling upset, stay positive.'
    })

  console.log('done.')
})