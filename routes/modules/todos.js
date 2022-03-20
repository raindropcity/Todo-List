// /routes/modules/todos.js這支檔案用來設定「CRUD」路由。之後匯出路由，於「總路由」/routes/index.js這支檔案中引用。

const express = require('express')
// Express中專門用於設定路由器的方法
const router = express.Router()
// 引用「上一層的上一層的models資料夾中的todo.js檔案」
const Todo = require('../../models/todo')
const User = require('../../models/user')
// 引用express-validator，用於確認註冊表單中使用者輸入的內容合法性(使用解構賦值進行變數設定)
const { check, validationResult, matchedData, Result } = require('express-validator')
// 引用ensureAuthenticated()用來進行route protection
const ensureAuthenticated = require('./passport').ensureAuthenticated

// 按下主畫面右上角LogOut按鈕，將登出並導向Login畫面
router.get('/login', (req, res) => {
  if (req.isAuthenticated()) req.logout()
  return res.render('login')
})

router.get('/register', (req, res) => {
  return res.render('register')
})

router.post('/register',
  // check username
  check('userName').trim().notEmpty().withMessage('This field is required!').bail()
    .isAlphanumeric().withMessage('En alphabet or numeric only!').bail()
    .isLength({ min: 2, max: 12 }).withMessage('Username length must within 2 to 12!').bail()
    .custom(async (value) => {
      const existOrNot = await User.findOne({ userName: value })
      if (existOrNot) { throw new Error('This user name has already been used!') }
      return true
    }),
  // check email
  check('email').trim().notEmpty().withMessage('This field is required!').bail()
    .isEmail().withMessage('Invalid email address!').bail()
    .custom(async (value) => {
      const existOrNot = await User.findOne({ email: value })
      //throw出來的訊息會進到下方validationResult(req)專門放error的陣列中
      if (existOrNot) { throw new Error('This email address has already been registered!') }
      return true
    }),
  // check password
  check('password').trim().notEmpty().withMessage('This field is required!').bail()
    .isAlphanumeric().withMessage('En alphabet or numeric only!').bail()
    .isLength({ min: 8, max: 12 }).withMessage('Password length must within 8 to 12!'),
  // check confirm password
  check('confirmPassword').trim().notEmpty().withMessage('This field is required!').bail()
    .isAlphanumeric().withMessage('En alphabet or numeric only!').bail()
    .isLength({ min: 8, max: 12 }).withMessage('Password length must within 8 to 12!').bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) { throw new Error('Password is different from Confirm Password!') }
      return true
    }),
  (req, res) => {
    const { email, password, userName, confirmPassword } = req.body
    const errorOfValidation = validationResult(req)

    if (!errorOfValidation.isEmpty()) {
      console.log(errorOfValidation.array())
      const invalidWarnObj = {}
      errorOfValidation.array().forEach((value) => {
        invalidWarnObj[`${value.param}`] = value.msg //使用Object的括弧記法將errorOfValidation.array()中的param與msg提取出來，裝進新的物件中
      })
      console.log(invalidWarnObj)
      return res.status(422).render('register', {
        inputedContent: { email, password, userName, confirmPassword }, //於頁面保留使用者前次輸入的內容
        warning: invalidWarnObj //render出各欄位的「無效原因」
      })
    }

    User.create({
      email: email,
      password: password,
      userName: userName,
      confirmPassword: confirmPassword
    })
      .then(() => {
        return res.redirect('/todos')
      })
      .catch((err) => { console.log(err) })
  })

router.get('/new', ensureAuthenticated, (req, res) => {
  // 叫 view 引擎去拿 new 樣板
  return res.render('new')
})

// 新增一筆資料
router.post('/', ensureAuthenticated, (req, res) => {
  const { agendas, content } = req.body // 從 req.body拿出表單裡的agendas資料(關於req.body見password generator專案中有解釋)

  // create()：直接呼叫Todo物件新增資料
  return Todo.create({ agendas, content })
    .then(() => { res.redirect('/todos') })
    .catch((error) => console.log(error))

  // 另一種寫法：另外設定一個變數存放新增資料的實體，然後用save()將新增的資料存入資料庫
  // const todo = new Todo({ name })
  // // save()：存入資料庫
  // todo.save()
  //   .then(() => { res.redirect('/') }) // 資料新增完成後導回首頁
  //   .catch((error) => { console.error(error) })
})

// 瀏覽一筆特定資料，見筆記「動態路由」
router.get('/:id', ensureAuthenticated, (req, res) => {
  const id = req.params.id
  // findById()：以id去資料庫尋找某特定資料
  return Todo.findById(id)
    .lean()
    .sort({ _id: 'asc' }) //sort()是排序，asc為正序；desc為反序。這邊是使用「_id」值來作為排序依據，也就是先入資料庫者在越前面。
    .then((todo) => { res.render('detail', { todo: todo }) })
    .catch((error) => { console.log(error) })
})

// 修改一筆特定資料
router.get('/:id/edit', ensureAuthenticated, (req, res) => {
  const id = req.params.id
  // findById()：以id去資料庫尋找某特定資料
  return Todo.findById(id)
    .lean()
    .then((todo) => { res.render('edit', { todo: todo }) })
    .catch((error) => { console.log(error) })
})

router.put('/:id', ensureAuthenticated, (req, res) => {
  const id = req.params.id
  // const name = req.body.name
  // const isDone = req.body.isDone
  // 解構賦值，將上面二行的name與isDone變數設定，縮寫成如下這樣。理解方式在於「想要把"req.body物件"裡的屬性一項項拿出來存成變數」。
  const { agendas, content, isDone } = req.body

  // 在「新增資料」時，比較過 Todo.create() 和 todo.save()，前者是操作整份資料，後者是針對單一資料。
  // 「新增資料」時兩種作法都可以，而這次因為搭配的資料操作是 Todo.findById，這個方法只會返回一筆資料，所以後面需要接 todo.save() 針對這一筆資料進行儲存
  // 呼叫了兩次資料操作方法(save()與redirect())，因此有兩段 .then()
  return Todo.findById(id)
    .then((todo) => {
      // 用來判斷checkbox有沒有被勾選的條件式，可以優化成這樣。因為(isDone === 'on')的結果就是true或false(使用者有勾選，判斷出來就是true；反之沒勾選，判斷出來就是false)，而資料庫中儲存的isDone欄位本身就是要填布林值，所以剛好直接重新賦值給todo.isDone，就不用寫下面的if/else條件式來判斷todo.isDone應該重新賦值成true還是false了。
      todo.isDone = (isDone === 'on')
      // if (isDone === 'on') {
      //   todo.isDone = true
      // } else {
      //   todo.isDone = false
      // }
      todo.agendas = agendas
      todo.content = content
      return todo.save()
    })
    .then(() => { res.redirect(`/todos/${id}`) })
    .catch((error) => { console.log(error) })
})

// 刪除一筆特定資料
router.delete('/:id', ensureAuthenticated, (req, res) => {
  const id = req.params.id
  // 呼叫了兩次資料操作方法(remove()與redirect())，因此有兩段 .then()
  return Todo.findById(id)
    .then((todo) => { todo.remove() })
    .then(() => { res.redirect('/todos') })
    .catch((error) => { console.log(error) })
})

// 匯出路由給「總路由(/routes/index.js)」去引用
module.exports = router