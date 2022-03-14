// 這支檔案用來寫Login的使用者身分驗證(使用中介軟體Passport)
const express = require('express')
const router = express.Router()
const User = require('../../models/user')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy

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
    //因此第30至43行可以看成這樣：
    // (function(req, res, next){...})(req, res, next)
    // 而第43行加上(req, res, next)，形成一個middleware的架構
    // 資源：https://stackoverflow.com/questions/60140011/what-does-req-res-next-at-bottom-mean
  })

module.exports = {
  router: router,
  exportPassport: passport,
}