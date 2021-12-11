const express = require('express')
const app = express()

const port = 3000

const Todo = require('./models/todo')

// 引入路由器時，路徑設定為 /routes 就會自動去尋找目錄下叫做 index 的檔案。
const routes = require('./routes')

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

// 引用method-override套件，它是Express的中介軟體，中介軟體是在request傳進來時進行處理流程，再接續到response的套件(例如body-parser也是中介軟體)。
// 由於HTML中的<form>的method屬性只有GET或POST，無法使用RESTful風格的路由設計方式，因此使用method-override將應使用PUT、DELETE等HTTP動詞的路由，從GET或POST覆蓋為PUT或DELETE等原生HTML元素不支援的動詞。
const methodOverride = require('method-override')
// _method是method-override的一個參數。用途是在HTML元素中的路由設定裡加入「?_method=DELETE」(見index.hbs頁面中DELETE按鈕的<form>的action設定)，method-override會幫我們將「?_method」後面的內容(這邊是以DELETE為例)轉換成controller頁(就是app.js)所設定的HTTP方法(以app.delete()為例)。
app.use(methodOverride('_method'))

// routes是上面設定的變數，用來存放「總路由(/routes/index.js)」
app.use(routes)

app.listen(port, () => {
  console.log(`App is running on http://localhost:${port}`)
})