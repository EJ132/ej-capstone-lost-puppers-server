const express = require('express')
const path = require('path')
const CommentsService = require('./comment-service')
const { requireAuth } = require('../middleware/jwt-auth')

const CommentRouter = express.Router()
const jsonBodyParser = express.json()

CommentRouter
  .route('/')
  .all(requireAuth)
  .post(requireAuth, jsonBodyParser, (req, res, next) => {
    const { pup_id, comment } = req.body
    const newComment = { pup_id, comment }

    for (const [key, value] of Object.entries(newComment))
      if (value == null)
        return res.status(400).json({
          error: `Missing '${key}' in request body`
        })

    newComment.user_id = req.user.id

    CommentsService.insertComment(
      req.app.get('db'),
      newComment
    )
      .then(Comment => {
        res
          .status(201)
          .location(path.posix.join(req.originalUrl, `/${Comment.id}`))
          .json(CommentsService.serializeComment(Comment))
      })
      .catch(next)
    })

module.exports = CommentRouter