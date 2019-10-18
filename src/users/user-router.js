const express = require('express')
const {requireAuth} = require('../middleware/jwt-auth')

const userRouter = express.Router()
const jsonBodyParser = express.json()
const path = require('path')

const UsersService = require('./user-service')

userRouter
  .post('/', jsonBodyParser, (req, res, next) => {
    const { password, user_name, fullname } = req.body
    for (const field of ['fullname', 'user_name', 'password'])
       if (!req.body[field])
         return res.status(400).json({
           error: `Missing '${field}' in request body`
         })

    const passwordError = UsersService.validatePassword(password)

    if (passwordError)
     return res.status(400).json({ error: passwordError })

    UsersService.hasUserWithUserName(
      req.app.get('db'),
      user_name
    )
      .then(hasUserWithUserName => {
        if (hasUserWithUserName)
          return res.status(400).json({ error: `Username already taken` })

    return UsersService.hashPassword(password)
        .then(hashedPassword => {
            const newUser = {
                user_name,
                password: hashedPassword,
                fullname
            }

            return UsersService.insertUser(
                req.app.get('db'),
                newUser
            )
                .then(user => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${user.id}`))
                    .json(UsersService.serializeUser(user))
                })
        })
        .catch(next)
    })
})

module.exports = userRouter;