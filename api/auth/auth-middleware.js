const { findBy } = require('./auth-model')


const checkUserReg = async (req, res, next) => {
    try {
        const [newUser] = await findBy({ username: req.body.username })
        if(req.body.username === newUser.username) {
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

module.exports = {
    checkUserReg,
}