const express = require('express')
const ProfileService = require('./profile-service')
const {requireAuth} = require('../middleware/jwt-auth')

const ProfileRouter = express.Router()

ProfileRouter
    .route('/:user_name')
    .all(requireAuth)
    .all(checkUserExist)
    .get((req, res, next) => {
        ProfileService.getUserById(
            req.app.get('db'),
            req.params.user_name
        )
        .then(user => {
            res.json(ProfileService.serializeProfile(user))
        })
        .catch(next)
    })

/* async/await syntax for promises */
async function checkUserExist(req, res, next) {
    try {
      const user = await ProfileService.getUserById(
        req.app.get('db'),
        req.params.user_name
      )
  
      if (!user)
        return res.status(404).json({
          error: `User doesn't exist`
        })
  
      res.user = user
      next()
    } catch (error) {
      next(error)
    }
}

module.exports = ProfileRouter