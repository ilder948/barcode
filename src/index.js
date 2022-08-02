const express = require('express')
const app = express()
const morgan = require('morgan')
const {sequelize} = require('./libs/sequelize')
const router = require('./router/index')

app.set('port', 3001)
app.use(express.json({ extended: true }))
app.use(express.urlencoded({ extended: true }))
app.use(morgan('combined'))
router(app)


app.listen(app.get('port'), () => {
  console.log(`Server running ${app.get('port')}`)
})