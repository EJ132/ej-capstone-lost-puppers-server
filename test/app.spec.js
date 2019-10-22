const app = require('../src/app')

describe('App', () => {
  it('GET / responds with 500', () => {
    return supertest(app)
      .get('/api/pups')
      .expect(500)
  })
})