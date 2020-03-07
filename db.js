const fs = require('fs')
const uuid = require('uuid')
const pg = require('pg')

const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/acme_db'
)

client.connect()

const sync = async () => {}
const findAllUsers = () => {}
const findAllDepartments = () => {}

module.exports = {
  sync,
  findAllUsers,
  findAllDepartments
}
