const db = require('../../config/mongoose')
const User = require('../user')

db.once('open', () => {
  User.create({
    email: 'raindropcity0209@gmail.com',
    password: 'raindrop0209',
    userName: 'Ray',
    comfirmPassword: 'raindrop0209'
  })

  console.log('done.')
})

