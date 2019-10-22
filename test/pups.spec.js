const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('pups Endpoints', function() {
    let db
  
    const {
      testUsers,
      testPups,
      testComments,
    } = helpers.makePupsFixtures()
  
    before('make knex instance', () => {
      db = knex({
        client: 'pg',
        connection: process.env.DATABASE_URL,
      })
      app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => helpers.clearTables(db))

    afterEach('cleanup', () => helpers.clearTables(db))

    describe(`GET /api/pups`, () => {

        context(`Given no pups`, () => {
            it(`responds with 200 and an empty list`, () => {
                return supertest(app)
                    .get('/api/pups')
                    .expect(200, [])
            })
        })

        context('Given there are pups in the database', () => {
            beforeEach('insert pups', () => helpers.seedPups(db, testUsers, testPups, testComments))
            
            it('responds with 200 and all of the pups', () => {
                const expectedPups = testPups.map(pup => helpers.makeExpectedPup(testUsers, pup, testComments))
                return supertest(app)
                    .get('/api/pups')
                    .expect(200, expectedPups)
            })
        })
    })

    describe(`GET /api/pups/:id`, () => {
        context(`Given no pups`, () => {
            beforeEach(() => helpers.seedUsers(db, testUsers))
            it(`responds with 404`, () => {
              const pupId = 123456
              return supertest(app)
                .get(`/api/pups/${pupId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(404, { error: `Pup doesn't exist` })
            })
          })
      
          context('Given there are pups in the database', () => {
            beforeEach('insert pups', () =>
              helpers.seedPups(
                db,
                testUsers,
                testPups,
                testComments,
              )
            )
      
            it('responds with 200 and the specified thing', () => {
              const pupId = 2
              const expectedThing = helpers.makeExpectedPup(
                testUsers,
                testPups[pupId - 1],
                testComments,
              )
      
              return supertest(app)
                .get(`/api/pups/${pupId}`)
                .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
                .expect(200, expectedThing)
            })
          })
    })
    
})