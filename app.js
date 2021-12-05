const express = require('express')
const app = express()
const exphbs = require('express-handlebars')
const mongoose = require('mongoose')
// 取得資料庫連線狀態
const db = mongoose.connection
const port = 3000

const Todo = require('./models/todo')

mongoose.connect('mongodb://localhost/todo_list', { useNewUrlParser: true, useUnifiedTopology: true })

// 資料庫連線異常
// db.on()：在這裡用 on 註冊一個事件監聽器，用來監聽 error 事件有沒有發生。
db.on('error', () => {
  console.log('mongodb error')
})

// 資料庫連線成功
// db.once()：針對「連線成功」的 open 情況，註冊一個事件監聽器，相對於「錯誤」，連線成功只會發生一次，所以這裡特地使用 once，一旦連線成功，在執行 callback 以後就會解除監聽器。
db.once('open', () => {
  console.log('mongodb connected')
})

// 建立一個名為hbs的樣板引擎，並傳入exphbs的相關參數
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
// 啟用樣板引擎hbs
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  // find()：取出 Todo model 裡的所有資料，現在沒有傳入任何參數，所以會撈出整份資料。
  // lean()：把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列，這裡可以記一個口訣：「撈資料以後想用 res.render()，要先用 .lean() 來處理」。
  // .then() 這一步資料會被放進 todos 變數
  // catch()：如果有錯誤的話先把錯誤內容印出來
  Todo.find().lean().then((todos) => {
    res.render('index', { todos: todos })
  })
    .catch((error) => { console.error(error) })
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})