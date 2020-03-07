const fs = require('fs')
const uuid = require('uuid')
const pg = require('pg')

const client = new pg.Client(
  process.env.DATABASE_URL || 'postgres://localhost/acme_db'
)

client.connect()

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
}
const findAllUsers = () => {}
const findAllDepartments = () => {}

module.exports = {
  sync,
  findAllUsers,
  findAllDepartments
}
