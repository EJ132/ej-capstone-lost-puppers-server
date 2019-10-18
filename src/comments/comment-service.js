const xss = require('xss')

const CommentsService = {
  getById(db, id) {
    return db
      .from('pup_comments AS pup')
      .select(
        'pup.id',
        'pup.comment',
        'pup.date_created',
        'pup.pup_id',
        db.raw(
          `row_to_json(
            (SELECT tmp FROM (
              SELECT
                usr.id,
                usr.user_name,
                usr.fullname
            ) tmp)
          ) AS "user"`
        )
      )
      .leftJoin(
        'users AS usr',
        'pup.user_id',
        'usr.id',
      )
      .where('pup.id', id)
      .first()
  },

  insertComment(db, newComment) {
    return db
      .insert(newComment)
      .into('pup_comments')
      .returning('*')
      .then(([comment]) => comment)
      .then(comment =>
        CommentsService.getById(db, comment.id)
      )
  },

  serializeComment(Comment) {
    return {
      id: Comment.id,
      comment: xss(Comment.comment),
      pup_id: Comment.pup_id,
      date_created: Comment.date_created,
      user: Comment.user || {},
    }
  }
}

module.exports = CommentsService