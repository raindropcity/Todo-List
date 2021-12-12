// 由於 Mongoose 連線是屬於專案的環境設定 (configuration)，所以我們習慣將其歸入一個叫 config 的資料夾。
// 本來Mongoose的連線設定是寫在app.js以及todoSeeder.js中，一樣的東西寫了二次，且後續要修改時要修改二個地方，容易遺漏，因此獨立一支檔案出來寫，再於需要用到Mongoose連線的地方引用。

// 載入Mongoose
const mongoose = require('mongoose')
// 取得資料庫連線狀態
const db = mongoose.connection
// 這邊路徑代表在主機建立一個名為「todo_list」的database。因此去Robo 3T 中看資料庫時，會看到有個叫todo_list的database。
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

// 匯出變數db，在todoSeeder.js中會用到。
module.exports = db