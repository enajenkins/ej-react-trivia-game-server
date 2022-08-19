const express = require('express');
const Users = require('../models/Users'); // use the mongoose user schema we created instead of using mongoose directly - creates less work
const bcrypt = require('bcrypt'); // hashes the password
const jwt = require('jsonwebtoken'); // so you can create a web token
const checkAuth = require('../middleware/check-auth'); // simple middleware we created in place of passport
const { loginValidator, registerValidator } = require('../validators/validators'); // to validate register and login forms

const router = express.Router();

const saltRounds = 10;


/** ------ ROUTE ENDPOINTS (that we can test with postman) ------ */

// login an existing user
// should return user data object in postman
router.post('/login', (req, res) => {
  // 
  const { errors, isValid } = loginValidator(req.body);
  if (!isValid) {
    res.json({ success: false, errors });
  } else {
    // find existing user with their email (unique identifier)
    Users.findOne({ email: req.body.email }).then(user => {
      if (!user) { // if there is no user, send the error message 
        res.json({ message: 'Email does not exist', success: false });
      } else { // if there is a user, compare the submitted password to the one stored, then resolve the promise with either the comparison result salt or reject it with an error
        bcrypt.compare(req.body.password, user.password).then(success => {
          if (!success) { 
            res.json({ message: 'Invalid Password', success: false});
          } else { // 
            const payload = {
              id: user._id,
              name: user.firstName
            }
            // synchronously sign the given payload into a JSON Web Token string payload 
            jwt.sign(
              payload,
              process.env.APP_SECRET, { expiresIn: 2155926 },
              (err, token) => {
                res.json({
                  user,
                  token: 'Bearer Token: ' + token,
                  success: true
                })
              }
            )
          }
        })
      }
    })

  }
});

// create a user via registration
// there will be no jwt if they are registering
router.post('/register', (req, res) => {
  // 
  const { errors, isValid } = registerValidator(req.body);
  if (!isValid) {
    res.json({ success: false, errors });
  } else {
    // destructure the user properties to make it easier
    const { firstName, lastName, email, password } = req.body;
    const registerUser = new Users({
      firstName, 
      lastName, 
      email, 
      password,
      createdAt: new Date()
    });

    /** 
     * salt - random string usually about 20 characters in length that gets added to the password and you login by comparing hashes
     * 
     * saltRounds - the cost factor that controls how much time is needed to calculate a single BCrypt hash. The higher the cost factor, the more hashing rounds are done. Increasing the cost factor by 1 doubles the necessary time. The more time is necessary, the more difficult is brute-forcing
     * 
     * Tutorial on bcrypt salting and hashing - https://www.martinstoeckli.ch/hash/en/index.php
     * https://stackoverflow.com/questions/46693430/what-are-salt-rounds-and-how-are-salts-stored-in-bcrypt
    */
    bcrypt.genSalt(saltRounds, (er, salt) => {
      // create a hash and pass in salt
      bcrypt.hash(registerUser.password, salt, (hashErr, hash) => {

        // basic validation
        if (er || hashErr) {
          res.json({ message: 'Error occurred hashing', success: false });
          return;
        }
        registerUser.password = hash;

        // save user to database
        registerUser.save().then(() => {
          res.json({ message: 'User created successfully', success: true });
        }).catch(er => res.json({ message: er.message, success: false }));
      })
    })
  }
})

// // adding the user id that is returned from the login to the url in postman (http://localhost:9000/api/users/62ff047d7e612c1cefacf841) should return the user data object
// // adding checkAuth param should return "message": "User Not Authorized" in postman
// router.post('/:id', checkAuth, (req, res) => {
//   Users.findOne({ _id: req.params.id }).then(user => {
//     res.json({ user, success: true })
//   }).catch(er => {
//     res.json({ success: false, message: er.message});
//   })
// })

// 
module.exports = router;
