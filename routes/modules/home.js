// /routes/modules/home.js這支檔案用來設定「首頁」路由。之後匯出路由，於「總路由」/routes/index.js這支檔案中引用。

const express = require('express')
// Express中專門用於設定路由器的方法
const router = express.Router()
// 引用「上一層的上一層的models資料夾中的todo.js檔案」
const Todo = require('../../models/todo')

router.get('/', (req, res) => {
  if (!req.isAuthenticated()) {
    return res.render('login')
  }
  // find()：取出 Todo model 裡的所有資料，現在沒有傳入任何參數，所以會撈出整份資料。
  // lean()：把 Mongoose 的 Model 物件轉換成乾淨的 JavaScript 資料陣列，這裡可以記一個口訣：「撈資料以後想用 res.render()，要先用 .lean() 來處理」。
  // .then() 這一步資料會被放進 todos 變數
  // catch()：如果有錯誤的話先把錯誤內容印出來
  Todo.find()
    .lean()
    .then((todos) => {
      res.render('index', { todos: todos })
    })
    .catch((error) => { console.log(error) })
})

// 匯出路由給「總路由(/routes/index.js)」去引用
module.exports = router