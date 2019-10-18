const xss = require('xss')

const ProfileService = {

    getAllUsers(db) {
        return db
        .select('*')
        .from('users')
    },
    
    getUserById(db, user_name) {
        return ProfileService.getAllUsers(db)
            .where('user_name', user_name)
            .first()
    },

    serializeProfile(user) {
        return {
          id: user.id,
          fullname: xss(user.fullname),
          user_name: xss(user.user_name)
        }
    },

}

module.exports = ProfileService