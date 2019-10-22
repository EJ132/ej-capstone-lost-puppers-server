const knex = require('knex')
const app = require('../src/app')
const helpers = require('./test-helpers')

describe('Comments Endpoints', function() {
  let db

  const {
    testPups,
    testUsers,
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

  describe(`POST /api/comments`, () => {
    beforeEach('insert pups', () =>
      helpers.seedPups(
        db,
        testUsers,
        testPups,
        testComments,
      )
    )

    it(`creates a comment, responding with 201 and the new comment`, function() {
      this.retries(3)
      const testPup = testPups[0]
      const testUser = testUsers[0]
      const newComment = {
        comment: 'Test new review',
        pup_id: testPup.id
      }
      return supertest(app)
        .post('/api/comments')
        .set('Authorization', helpers.makeAuthHeader(testUser))
        .send(newComment)
        .expect(201)
        .expect(res => {
          expect(res.body).to.have.property('id')
          expect(res.body.comment).to.eql(newComment.comment)
          expect(res.headers.location).to.eql(`/api/comments/${res.body.id}`)
        })
        .expect(res =>
          db
            .from('pup_comments')
            .select('*')
            .where({ id: res.body.id })
            .first()
            .then(row => {
              expect(row.comment).to.eql(newComment.comment)
            })
        )
    })

    const requiredFields = ['comment', 'pup_id']

    requiredFields.forEach(field => {
      const testPup = testPups[0]
      const testUser = testUsers[0]
      const newComment = {
        comment: 'Test new comment',
        pup_id: testPup.id
      }

      it(`responds with 400 and an error message when the '${field}' is missing`, () => {
        delete newComment[field]

        return supertest(app)
          .post('/api/Comments')
          .set('Authorization', helpers.makeAuthHeader(testUsers[0]))
          .send(newComment)
          .expect(400, {
            error: `Missing '${field}' in request body`,
          })
      })
    })
  })
})
