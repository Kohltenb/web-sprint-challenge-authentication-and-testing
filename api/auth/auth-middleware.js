const { findBy } = require('./auth-model')


const checkUserReg = async (req, res, next) => {
    try {
        const [user] = await findBy({ username: req.body.username })
        if(user) {
            next({ status: 401, message: "username taken"})
        } else if(!req.body.username || !req.body.password) {
            next({ status: 422, message: "username and password required"})
        } else {
            next()
        }
    } catch (err) {
        next(err)
    }
}

const checkUserExists = async (req, res, next) => {
    try {
        const [user] = await findBy({ username: req.body.username })
        if(!user) {
            next({status: 401, message: "invalid credentials" })
        } else {
            req.user = user
            next()
        }
    } catch (err) {
        next(err)
    }
}

module.exports = {
    checkUserReg,
    checkUserExists
}