const express = require('express')
const app = express()

const port = 3000

const Todo = require('./models/todo')

const mongoose = require('mongoose')
// 取得資料庫連線狀態
const db = mongoose.connection

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

const exphbs = require('express-handlebars')
// 建立一個名為hbs的樣板引擎，並傳入exphbs的相關參數
app.engine('hbs', exphbs({ defaultLayout: 'main', extname: '.hbs' }))
// 啟用樣板引擎hbs
app.set('view engine', 'hbs')

// 使用body-parser所提供的解析URL方法(body-parser已內建於Express中)，見password generator專案中有解釋。use()代表任何request都要先經過這邊
app.use(express.urlencoded({ extended: true }))

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

app.get('/todos/new', (req, res) => {
  // 叫 view 引擎去拿 new 樣板
  res.render('new')
})

// 新增一筆資料
app.post('/todos', (req, res) => {
  const name = req.body.name // 從 req.body拿出表單裡的name資料(關於req.body見password generator專案中有解釋)

  // create()：直接呼叫Todo物件新增資料
  Todo.create({ name })
    .then(() => { res.redirect('/') })
    .catch((error) => console.error(error))

  // 另一種寫法：另外設定一個變數存放新增資料的實體，然後用save()將新增的資料存入資料庫
  // const todo = new Todo({ name })
  // // save()：存入資料庫
  // todo.save()
  //   .then(() => { res.redirect('/') }) // 資料新增完成後導回首頁
  //   .catch((error) => { console.error(error) })
})

// 瀏覽一筆資料，見筆記「動態路由」
app.get('/todos/:id', (req, res) => {
  const id = req.params.id
  Todo.findById(id)
    .lean()
    .then((todo) => { res.render('detail', { todo: todo }) })
    .catch((error) => { console.error(error) })
})

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})