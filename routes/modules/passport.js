// 這支檔案用來寫Login的使用者身分驗證(使用中介軟體Passport)
const express = require('express')
const app = express()
const router = express.Router()
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session) //後續初始化express-session時，用來設定「將session存在MongoDB裡面
const User = require('../../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

// 初始化express-session
app.use(session({
  secret: 'road to become software engineer', //必要欄位，用來註冊 session ID cookie 的字串。如此將增加安全性，避免他人在瀏覽器中偽造 cookie。
  resave: false, //不論 request 的過程中有無變更都重新將 session 儲存在 session store。
  saveUninitialized: false, //將 uninitialized session（新的、未被變更過的） 儲存在 session store 中。
  store: new MongoDBStore({
    uri: 'mongodb://localhost/todo_list',
    collection: 'mySessions'
  }) //設定session要存放的資料庫位子(存在MongoDB裡面)
}))
// 初始化passport
app.use(passport.initialize())
app.use(passport.session())

// serializeUser()控制「要將哪些通過驗證的使用者資訊(物件形式)存進session中」，這邊是將使用者的「_id」存進去。
passport.serializeUser((user, done) => {
  done(null, user._id)
})
// deserializeUser()則用於將serializeUser()存進去session的物件取出，並將該物件存入req.user中，供後續取用。
passport.deserializeUser((id, done) => {
  User.findById(id, (err, foundUser) => {
    done(err, foundUser)
  })
})

// 撰寫驗證策略，這邊採用passport-local策略
const strategy = new LocalStrategy(
  // passport-local預設以資料庫中的username與password欄位進行身分驗證，若資料庫中的欄位名稱並非前述，要記得於此更改
  {
    usernameField: 'email'
  },
  function verify(email, password, done) {
    User.findOne({ email: email }, (err, foundUser) => {
      if (err) return done(err)
      if (!foundUser) return done(null, false, { message: 'Incorrect email address!' })
      if (foundUser.password !== password) return done(null, false, { message: 'Incorrect password!' })
      return done(null, foundUser)
    })
  }
)
// 使用驗證策略
passport.use(strategy)

router.post('/login',
  // 將passport.authenticate()寫在callback中，而不直接使用Passport內建以middleware形式的寫法。
  // 這樣可以在passport.authenticate()裡面使用res, req等參數
  (req, res, next) => {
    passport.authenticate('local', (err, user, info) => {
      if (err) return next(err)
      if (!user) {
        const { email, password } = req.body
        return res.status(422).render('login', {
          errPrompt: info.message,
          inputedContent: { email, password }
        })
      }
      req.login(user, (err) => {
        if (err) return next(err)
        return res.redirect('/todos')
      })
    })(req, res, next) //passport.authenticate()會return一個函式：function(req, res, next){...}。而在函式裡面return另一個函式，是閉包(closure)的概念。
    //因此第58至71行可以看成這樣：
    // (function(req, res, next){...})(req, res, next)
    // 而第71行加上(req, res, next)，形成一個middleware的架構
    // 資源：https://stackoverflow.com/questions/60140011/what-does-req-res-next-at-bottom-mean
  })

module.exports = {
  router: router,
  exportPassport: passport
}