// Write your tests here
const request = require('supertest')
const db = require('../data/dbConfig.js')
const server = require('./server.js')
const User = require('./auth/auth-model')


test('sanity', () => {
  expect(true).toBe(true)
})

beforeAll(async () => {
  await db.migrate.rollback()
  await db.migrate.latest()
})

beforeEach(async () => {
  await db('users').truncate()
  await db.seed.run()
})

afterAll(async () => {
  await db.destroy()
})

it('correct env var', () => {
  expect(process.env.NODE_ENV).toBe('testing')
})

describe('testing modules', () => {
  test('findBy', async () => {
    const results = await db('users')
    expect(results).toHaveLength(2)
  })

  test('findById', async () => {
    const results = await User.findById(1)
    expect(results).toEqual({username: 'obi wan', id: 1, password: '$2a$08$gdE7udGERouKN2lOQNW/t.oVPWxtova/.jXfh/63VKzEMJNLR.aga'})
  })

  test('add', async () => {
    const user = {username: 'mace windu', password: '$2a$08$gdE7udGERouKN2lOQNW/t.oVPWxtova/.jXfh/63VKzEMJNLR.aga'}
    await User.add(user)
    const results = await db('users')
    expect(results).toHaveLength(3)
  })
})


describe('required token to access jokes', () => {

  it('gets error because does not have token', async () => {
   let result = await request(server).get('/api/jokes')
   expect(result.status).toBe(401)
   expect(result.body).toStrictEqual({"message": "token required"})
  })
})

describe('http endpoints', () => {

  it('POST REGISTER adds new user to database', async () => {
    const user = { username: 'yoda', id: 3, password: '1234'}
    let result = await request(server).post('/api/auth/register').send(user)
    expect(result.body).toBeTruthy()
    expect(result.status).toBe(201)
    let list = await db('users')
    expect(list).toHaveLength(3)
  })

  it('POST REGISTER throws error if field is missing', async () => {
    const user = { username: 'anakin', password: ''}
    let result = await request(server).post('/api/auth/register').send(user)
    expect(result.body).toStrictEqual({"message": "username and password required"})
    expect(result.status).toBe(422)
  })

  it('POST LOGIN sends error when wrong username is inputed', async () => {
    const user = { username: 'foo',
    password: 'bar' }
    let result = await request(server).post('/api/auth/login').send(user)
    expect(result.status).toBe(401)
    expect(result.body).toStrictEqual({"message": "invalid credentials"})
  })
  it('POST LOGIN verifies that username and password match database', async () => {
    const user = {
      username: 'obi wan',
      password: '1234', //$2a$08$gdE7udGERouKN2lOQNW/t.oVPWxtova/.jXfh/63VKzEMJNLR.aga
    }
    let result = await request(server).post('/api/auth/login').send(user)
    let token = result.body.token
    expect(result.body).toEqual({"message": "Welcome obi wan", token}) 
    expect(result.status).toBe(200)
  })
})