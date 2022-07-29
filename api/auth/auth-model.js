const db = require('../../data/dbConfig')

function findBy(filter) {
    return db('users')
    .select('username')
    .where(filter)
}

function findById(id) {
    return db('users')
    .select('id', 'username', 'password')
    .where('id', id).first()
}

async function add(user) {
   const [id] = await db('users').insert(user)
   return findById(id)
}


// let created_user
// await db.transaction(async trx => {
//     const [id] = await trx('users').insert({ username, password})
//     created_user = id
// })
// return findBy(created_user)


module.exports = {
    findBy,
    findById,
    add,
}