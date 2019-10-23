const express = require('express')
const PupsService = require('./pups-service')
const {requireAuth} = require('../middleware/jwt-auth')
const jsonBodyParser = express.json()
const multer = require('multer')

const storage = multer.diskStorage({
  destination: function(req, file, cb){
    cb(null, './uploads/');
  },
  filename: function(req, file, cb){
    cb(null, file.originalname);
  }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png'){
      cb(null, true)
    } else {
      cb(new Error('Please upload a jpeg or png image'), false)
    }
};

const upload = multer({
  storage: storage, 
  limits: {fileSize: 1024 * 1024 * 5},
  fileFilter: fileFilter
  }
);

const PupsRouter = express.Router()

PupsRouter
  .all(requireAuth)
  .post('/', upload.single('image'), (req, res, next) => {
    const image = req.file.path
    console.log(req.file);
    const {name, lat, long, description, category, zipcode, owner } = req.body
    const newPup = {name, image, description, lat, long, category, zipcode, owner }
    for (const field of ['name', 'lat', 'long', 'description', 'category', 'zipcode', 'owner'])
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
  .patch(jsonBodyParser, (req, res, next) => {
    const { name, description } = req.body
    const pupToUpdate = { name, description }

    const numberOfValues = Object.values(pupToUpdate).filter(Boolean).length
    if (numberOfValues === 0)
      return res.status(400).json({
        error: {
          message: `Request body must content either 'name' or 'description'`
        }
      })

    PupsService.updatePup(
      req.app.get('db'),
      req.params.id,
      pupToUpdate
    )
      .then(updatedPup => {
        res.status(200).json(updatedPup)
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