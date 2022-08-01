const router = require('express').Router();
const { JWT_SECRET } = require('../secrets/secret')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { checkUserReg, checkUserExists, checkInputs } = require('./auth-middleware')
const User = require('./auth-model')


router.post('/register', checkInputs, checkUserReg, (req, res) => {
  const { username, password } = req.body
  const hash = bcrypt.hashSync(password, 8)
  User.add({ username, password: hash})
  .then(newUser => {
    res.status(201).json(newUser)
  })
  .catch(err => {
    res.status(500).json(err)
  })
 //COMPLETE
});

router.post('/login', checkInputs, checkUserExists, (req, res, next) => {
  if(bcrypt.compareSync(req.body.password, req.user.password)) {
    const token = buildToken(req.user)
    res.json({
      message: `Welcome ${req.user.username}`,
      token,
    })
  } else {
    next({ status: 401, message: "invalid credentials"})
  }
  //COMPLETE
});

function buildToken(user) {
  const payload = {
    id: user.id,
    username: user.username,
    password: user.password
  }
  // const options = {
  //   algorithm: 'HS256',
  //   expriesIn: '1d'
  // }
  return jwt.sign(payload, JWT_SECRET,)
  //options
  //ASK ABOUT THIS DURING THE ZOOM MEETINGS
}


module.exports = router;

//notes for login
/*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.

    1- In order to log into an existing account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel",
        "password": "foobar"
      }

    2- On SUCCESSFUL login,
      the response body should have `message` and `token`:
      {
        "message": "welcome, Captain Marvel",
        "token": "eyJhbGciOiJIUzI ... ETC ... vUPjZYDSa46Nwz8"
      }

    3- On FAILED login due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

    4- On FAILED login due to `username` not existing in the db, or `password` being incorrect,
      the response body should include a string exactly as follows: "invalid credentials".
  */

//notes for post /register

 /*
    IMPLEMENT
    You are welcome to build additional middlewares to help with the endpoint's functionality.
    DO NOT EXCEED 2^8 ROUNDS OF HASHING!

    1- In order to register a new account the client must provide `username` and `password`:
      {
        "username": "Captain Marvel", // must not exist already in the `users` table
        "password": "foobar"          // needs to be hashed before it's saved
      }

    2- On SUCCESSFUL registration,
      the response body should have `id`, `username` and `password`:
      {
        "id": 1,
        "username": "Captain Marvel",
        "password": "2a$08$jG.wIGR2S4hxuyWNcBf9MuoC4y0dNy7qC/LbmtuFBSdIhWks2LhpG"
      }

  x  3- On FAILED registration due to `username` or `password` missing from the request body,
      the response body should include a string exactly as follows: "username and password required".

   x 4- On FAILED registration due to the `username` being taken,
      the response body should include a string exactly as follows: "username taken".
  */