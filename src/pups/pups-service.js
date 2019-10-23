const Treeize = require('treeize')
const xss = require('xss')

const PupsService = {
    getAllPups(db) {
        return db
        .select('*')
        .from('pups')
    },

    getAllComments(db, id){
      return db
        .from('pup_comments as pup')
        .select(
          'pup.id',
          'pup.comment',
          'pup.date_created',
          ...userFields,
        )
        .where('pup.pup_id', id)
        .leftJoin(
          'users AS usr',
          'pup.user_id',
          'usr.id'
        )
        .groupBy('pup.id', 'usr.id')
    },

    insertPup(db, newPup) {
      return db
        .insert(newPup)
        .into('pups')
        .returning('*')
        .then(([pup]) => pup)
        .then(pup => PupsService.getById(db, pup.id))
    },

    deletePup(db, id){
      return db('pups')
        .where('id', id)
        .delete()
    },

    updatePup(db, id, newPup) {
      return db('pups')
        .where('id', id)
        .update(newPup)
        .returning('*')
    },

    serializePups(pups) {
        return pups.map(this.serializePup)
    },

    serializePup(pup) {
        const pupTree = new Treeize()
    
        // Some light hackiness to allow for the fact that `treeize`
        // only accepts arrays of objects, and we want to use a single
        // object.
        const pupData = pupTree.grow([ pup ]).getData()[0]
    
        return {
          id: pupData.id,
          name: xss(pupData.name),
          description: xss(pupData.description),
          date_created: pupData.date_created,
          image: xss(pupData.image),
          lat: pupData.lat,
          long: pupData.long,
          category: pupData.category,
          zipcode: pupData.zipcode,
          owner: pupData.owner
        }
      },
    
      getById(db, id) {
        return PupsService.getAllPups(db)
          .where('id', id)
          .first()
      },
    
      serializePupComments(pups) {
        return pups.map(this.serializePupComment)
      },
    
      serializePupComment(pup) {
        const pupTree = new Treeize()
    
        // Some light hackiness to allow for the fact that `treeize`
        // only accepts arrays of objects, and we want to use a single
        // object.
        const pupData = pupTree.grow([ pup ]).getData()[0]
    
        return {
          id: pupData.id,
          comment: xss(pupData.comment),
          pup_id: pupData.pup_id,
          user: pupData.user || {},
          date_created: pupData.date_created,
        }
      },

}

const userFields = [
  'usr.id AS user:id',
  'usr.user_name AS user:user_name',
  'usr.fullname AS user:fullname',
]

module.exports = PupsService;