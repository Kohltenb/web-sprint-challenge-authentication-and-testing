// Write your tests here
const request = require('supertest')
const db = require('../data/dbConfig.js')
const server = require('./server.js')


const user1 = { username: 'foo', password: '1234' }
const user2 = { username: 'bar', password: '4321' }

test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
})

afterAll(async () => {
  await db.destroy()
})

it('correct env var', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

describe('[POST] registers a user', () => {
  it('adds user to db', async () => {
    let users = await db('users')
    expect(users).toHaveLength(0)
    await request(server).post('/register', user1)
    users = await db('users').
    expect(users).toHaveLength(1)
  })
})


// const [id] = await db('users').insert(user1)
//     let newUser = await db('users').where({id}).first()
//     expect(user).toHaveLength(1)