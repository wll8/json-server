const request = require('supertest')
const { parseArgv } = require('../../src/server/utils')
const cliArg = parseArgv(process.env.arg)
const jsonServer = require('../../src/server')

describe('$schema-ignore', () => {
  let server
  let router
  let db

  beforeEach(() => {
    db = {
      $schema: 'http://some.schema.somewhere/',
    }

    db.user = {
      name: 'foo',
      email: 'foo@example.com',
    }

    server = jsonServer.create()
    router = jsonServer.router(db, { ...cliArg })
    server.use(jsonServer.defaults())
    server.use(router)
  })

  test('doesnt error with $schema node', () => {
    return request(server).get('/user').expect(200, db.user)
  })
})
