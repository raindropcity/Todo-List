// /routes/modules/todos.js這支檔案用來設定「CRUD」路由。之後匯出路由，於「總路由」/routes/index.js這支檔案中引用。

const express = require('express')
// Express中專門用於設定路由器的方法
const router = express.Router()
// 引用「上一層的上一層的models資料夾中的todo.js檔案」
const Todo = require('../../models/todo')


router.get('/new', (req, res) => {
  // 叫 view 引擎去拿 new 樣板
  res.render('new')
})

// 新增一筆資料
router.post('/', (req, res) => {
  const name = req.body.name // 從 req.body拿出表單裡的name資料(關於req.body見password generator專案中有解釋)

  // create()：直接呼叫Todo物件新增資料
  return Todo.create({ name })
    .then(() => { res.redirect('/') })
    .catch((error) => console.log(error))

  // 另一種寫法：另外設定一個變數存放新增資料的實體，然後用save()將新增的資料存入資料庫
  // const todo = new Todo({ name })
  // // save()：存入資料庫
  // todo.save()
  //   .then(() => { res.redirect('/') }) // 資料新增完成後導回首頁
  //   .catch((error) => { console.error(error) })
})

// 瀏覽一筆特定資料，見筆記「動態路由」
router.get('/:id', (req, res) => {
  const id = req.params.id
  // findById()：以id去資料庫尋找某特定資料
  return Todo.findById(id)
    .lean()
    .sort({ _id: 'asc' }) //sort()是排序，asc為正序；desc為反序。這邊是使用「_id」值來作為排序依據，也就是先入資料庫者在越前面。
    .then((todo) => { res.render('detail', { todo: todo }) })
    .catch((error) => { console.log(error) })
})

// 修改一筆特定資料
router.get('/:id/edit', (req, res) => {
  const id = req.params.id
  // findById()：以id去資料庫尋找某特定資料
  return Todo.findById(id)
    .lean()
    .then((todo) => { res.render('edit', { todo: todo }) })
    .catch((error) => { console.log(error) })
})

router.put('/:id', (req, res) => {
  const id = req.params.id
  // const name = req.body.name
  // const isDone = req.body.isDone
  // 解構賦值，將上面二行的name與isDone變數設定，縮寫成如下這樣。理解方式在於「想要把"req.body物件"裡的屬性一項項拿出來存成變數」。
  const { name, isDone } = req.body

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
      todo.name = name
      return todo.save()
    })
    .then(() => { res.redirect(`/todos/${id}`) })
    .catch((error) => { console.log(error) })
})

// 刪除一筆特定資料
router.delete('/:id', (req, res) => {
  const id = req.params.id
  // 呼叫了兩次資料操作方法(remove()與redirect())，因此有兩段 .then()
  return Todo.findById(id)
    .then((todo) => { todo.remove() })
    .then(() => { res.redirect('/') })
    .catch((error) => { console.log(error) })
})

// 匯出路由給「總路由(/routes/index.js)」去引用
module.exports = router