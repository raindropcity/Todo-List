const db = require('../../config/mongoose')
const User = require('../user')

db.once('open', () => {
  User.create({
    email: 'raindropcity0209@gmail.com',
    password: 'raindrop0209',
    firstName: 'Ray',
    secondName: 'Fang'
  })

  console.log('done.')
})

