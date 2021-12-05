const express = require('express')
const app = express()
const mongoose = require('mongoose')
// 取得資料庫連線狀態
const db = mongoose.connection
const port = 3000
const exphbs = require('express-handlebars')

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

app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
app.set('view engine', 'hbs')

app.get('/', (req, res) => {
  res.render('index')
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})