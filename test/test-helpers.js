const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

function makeUsersArray(){
    return [
        {
            id: 1, 
            fullname: 'test user 1',
            user_name: 'test_user1',
            password: 'password'
        },
        {
            id: 2, 
            fullname: 'test user 2',
            user_name: 'test_user2',
            password: 'password'
        },
        {
            id: 3, 
            fullname: 'test user 3',
            user_name: 'test_user3',
            password: 'password'
        },
        {
            id: 4, 
            fullname: 'test user 4',
            user_name: 'test_user4',
            password: 'password'
        },
        {
            id: 5, 
            fullname: 'test user 5',
            user_name: 'test_user5',
            password: 'password'
        },
    ]
}

function makePupsArray(){
    return [
        {
            id: 1,
            name: 'test1',
            image: 'http://google.com',
            category: 'Small',
            description: 'test description 1',
            date_created: '2029-01-22T08:00:00.000Z',
            zipcode: '90260',
            owner: 1
        },
        {
            id: 2,
            name: 'test2',
            image: 'http://google.com',
            category: 'Medium',
            description: 'test description 2',
            date_created: '2029-01-22T08:00:00.000Z',
            zipcode: '90260',
            owner: 1
        },
        {
            id: 3,
            name: 'test3',
            image: 'http://google.com',
            category: 'Medium',
            description: 'test description 3',
            date_created: '2029-01-22T08:00:00.000Z',
            zipcode: '90260',
            owner: 2
        },
        {
            id: 4,
            name: 'test4',
            image: 'http://google.com',
            category: 'Large',
            description: 'test description 4',
            date_created: '2029-01-22T08:00:00.000Z',
            zipcode: '90260',
            owner: 3
        },
        {
            id: 5,
            name: 'test5',
            image: 'http://google.com',
            category: 'Small',
            description: 'test description 5',
            date_created: '2029-01-22T08:00:00.000Z',
            zipcode: '90260',
            owner: 2
        },
    ]
}

function makeCommentsArray(users, pups){
    return [
        {
            id: 1,
            comment: 'test comment 1',
            date_created: '2029-01-22T16:28:32.615Z',
            pup_id: pups[0].id,
            user_id: users[0].id
        },
        {
            id: 2,
            comment: 'test comment 2',
            date_created: '2029-01-22T16:28:32.615Z',
            pup_id: pups[1].id,
            user_id: users[1].id
        },
        {
            id: 3,
            comment: 'test comment 3',
            date_created: '2029-01-22T16:28:32.615Z',
            pup_id: pups[2].id,
            user_id: users[2].id
        },
        {
            id: 4,
            comment: 'test comment 4',
            date_created: '2029-01-22T16:28:32.615Z',
            pup_id: pups[3].id,
            user_id: users[3].id
        },
        {
            id: 5,
            comment: 'test comment 5',
            date_created: '2029-01-22T16:28:32.615Z',
            pup_id: pups[4].id,
            user_id: users[4].id
        },
    ]
}

function makeExpectedPup(users, pups, comments=[]){
    const user = users
        .find(user => user.id == pups.owner)

    const pupComments = comments
        .filter(comment => comment.pup_id === pups.id)

    return {
        id: pups.id,
        name: pups.name, 
        image: pups.image,
        category: pups.category,
        description: pups.description,
        date_created: pups.date_created,
        zipcode: pups.zipcode,
        owner: pups.owner,
    }
}

function makePupsFixtures(){
    const testUsers = makeUsersArray()
    const testPups = makePupsArray()
    const testComments = makeCommentsArray(testUsers, testPups)
    return {testUsers, testPups, testComments}
}

function clearTables(db){
    return db.raw(
        `TRUNCATE
        pups,
        users,
        pup_comments
        RESTART IDENTITY CASCADE`
    )
}

function seedUsers(db, users){
    const preppedUsers = users.map(user => ({...user, password: 
        bcrypt.hashSync(user.password, 1)}))
    
    return db.into('users').insert(preppedUsers)
        .then(() => db.raw(`SELECT setval('users_id_seq', ?)`,
            [users[users.length - 1].id],
        )
    )
}

function seedPups(db, users, pups, comments=[]){
    return db.transaction(async trx => {
        await seedUsers(trx, users)
        await trx.into('pups').insert(pups)

        await trx.raw(`SELECT setval('pups_id_seq', ?)`,
            [pups[pups.length - 1].id],
        )

        if (comments.length){
            await trx.into('pup_comments').insert(comments)
            await trx.raw(
                `SELECT setval('pup_comments_id_seq', ?)`,
                [comments[comments.length - 1].id],
            )
        }
    })
}

function makeAuthHeader(user, secret = process.env.JWT_SECRET){
    const token = jwt.sign({user_id: user.id}, secret, {
        subject: user.user_name,
        algorithm: 'HS256',
    })
    return  `Bearer ${token}`
}

module.exports = {
    makeUsersArray,
    makePupsArray,
    makeCommentsArray,
    makeExpectedPup,
    makePupsFixtures,
    clearTables,
    seedUsers,
    seedPups,
    makeAuthHeader
}