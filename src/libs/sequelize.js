

const { Sequelize } = require('sequelize')
const config = require('../config/index')
const sequelize = new Sequelize(
  config.DATABASE_RADICADOS, 
  config.USER_DATABASE_RADICADOS, 
  config.PASSWORD_DATABASE_RADICADOS, {
  host: config.SERVER_DATABASE_RADICADOS,
  dialect: 'mariadb', 
  logging: true
})

sequelize.authenticate().then(() => {
  console.log('Database Connect')
}).catch( error => {
  console.log(error)
})

module.exports = sequelize