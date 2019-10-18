const express = require('express')
const PupsService = require('./pups-service')
const {requireAuth} = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()

const PupsRouter = express.Router()

PupsRouter
  .all(requireAuth)
  .post('/', jsonBodyParser, (req, res, next) => {
    const {name, image, description, category, zipcode, owner } = req.body
    const newPup = {name, image, description, category, zipcode, owner }
    for (const field of ['name', 'image', 'description', 'category', 'zipcode', 'owner'])
       if (!req.body[field])
         return res.status(400).json({
           error: `Missing '${field}' in request body`
         })

    PupsService.insertPup(
      req.app.get('db'),
      newPup
    )
      .then(Pup => {
        res
          .status(201)
          .json(PupsService.serializePup(Pup))
      })

  })
  .get('/',(req, res, next) => {
    PupsService.getAllPups(req.app.get('db'))
      .then(pups => {
        res.json(PupsService.serializePups(pups))
      })
      .catch(next)
  })

PupsRouter
  .route('/:id')
  .all(requireAuth)
  .all(checkPupExists)
  .get((req, res) => {
    res.json(PupsService.serializePup(res.thing))
  })
  .delete((req, res, next) => {
    PupsService.deletePup(
      req.app.get('db'),
      req.params.id
    )
      .then(numRowsAffected => {
        res.status(204).end()
      })
      .catch(next)
  })

PupsRouter
  .route('/:id/comments')
  .all(requireAuth)
  .get((req, res, next) => {
    PupsService.getAllComments(
      req.app.get('db'),
      req.params.id
    )

    .then(comments => {
      res.json(PupsService.serializePupComments(comments))
    })
    .catch(next)
  })


/* async/await syntax for promises */
async function checkPupExists(req, res, next) {
  try {
    const thing = await PupsService.getById(
      req.app.get('db'),
      req.params.id
    )

    if (!thing)
      return res.status(404).json({
        error: `Pup doesn't exist`
      })

    res.thing = thing
    next()
  } catch (error) {
    next(error)
  }
}

module.exports = PupsRouter;