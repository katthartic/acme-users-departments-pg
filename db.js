const fs = require('fs')
const uuid = require('uuid')
const pg = require('pg')

const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/acme_db'
)

client.connect()

//CREATE/POST
const createDepartment = async ({ name }) => {
  const SQL = 'INSERT INTO departments(name) values($1) returning *'
  return (await client.query(SQL, [name])).rows[0]
}

const createUser = async ({ name, department_id }) => {
  const SQL =
    'INSERT INTO users(name, department_id) values($1, $2) returning *'
  return (await client.query(SQL, [name, department_id])).rows[0]
}

//GET
const findAllUsers = async () => {
  const SQL = 'SELECT * FROM users'
  return (await client.query(SQL)).rows
}
const findAllDepartments = async () => {
  const SQL = 'SELECT * FROM departments'
  return (await client.query(SQL)).rows
}

//SYNC
const sync = async () => {
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) UNIQUE NOT NULL,
        CHECK (char_length(name) > 0)
    );
    CREATE TABLE users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        name VARCHAR(100) UNIQUE NOT NULL,
        department_id UUID REFERENCES departments(id),
        CHECK (char_length(name) > 0)
    );
    `
  await client.query(SQL)

  //ADD ROWS TO DEPARTMENTS
  const deptsToInsert = ['HR', 'Sales', 'Marketing', 'IT']
  const depts = await Promise.all(
    deptsToInsert.map(name => createDepartment({ name }))
  )

  const usersToInsert = ['Moe', 'Larry', 'Curly', 'Lucy', 'Shep']
  const users = await Promise.all(
    usersToInsert.map(name => {
      const department_id =
        depts[Math.round(Math.random() * (depts.length - 1))].id
      createUser({ name, department_id })
    })
  )

  console.log(await findAllDepartments())
  console.log(await findAllUsers())
}

//EXPORTS
module.exports = {
  sync,
  findAllUsers,
  findAllDepartments
}
