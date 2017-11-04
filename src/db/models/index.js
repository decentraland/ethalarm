import fs from 'fs'
import path from 'path'
import Sequelize from 'sequelize'

var basename = path.basename(__filename)
var env = process.env.NODE_ENV || 'development'
var config = require(__dirname + '/../../config/database.json')[env]
var db = {}

var sequelize

if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable])
} else {
  sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  )
}

fs
  .readdirSync(__dirname)
  .filter(file => file.indexOf('.') !== 0 && file !== basename && file.slice(-3) === '.js')
  .forEach(file => {
    var model = sequelize.import(path.join(__dirname, file))
    db[model.name] = model
  })

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db)
  }
})

db.sequelize = sequelize
db.Sequelize = Sequelize

db.sequelize.sync() // async

module.exports = db
