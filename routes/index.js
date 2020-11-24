const express = require('express');
const router  = express.Router();

const User = require('../models/User.Model');
const bcrypt = require('bcryptjs');

/* GET home page */
router.get('/', (req, res, next) => {
  res.render('index');
});


/// SIGNUP ///
router.get('/signup', (req, res, next) => {
  res.render('signup');
});


router.post('/signup', (req, res, next) => {

  // // make sure fields are not empty
  if (!req.body.username || !req.body.email || !req.body.password) {
      res.render('signup', { errorMessage: 'All fields are mandatory. Please provide your username, email and password.' });
      return;
  }

  // make sure passwords are strong:
  const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  if (!regex.test(req.body.password)) {
      res
          .status(500)
          .render('signup', { errorMessage: 'Password needs to have at least 6 chars and must contain at least one number, one lowercase and one uppercase letter.' });
      return;
  }

  // creates salt
  // 10 stands for the number of salt rounds
  const salt = bcrypt.genSaltSync(10);

  // bcrypt.hashSync() method receives two different parameters: the password we are going to encrypt and the value of previously generated salt
  const pwHash = bcrypt.hashSync(req.body.password, salt);

  // creates an object in the database
  // req.body.password > password > same as in the form
  // passwordHash: pwHash > passwordHash > same as in the databank
  User.create({ username: req.body.username, email: req.body.email, passwordHash: pwHash }).then(user => {
    req.session.user = user;  
    res.redirect('/recipes');
  })
      .catch(error => {
          if (error.code === 11000) {
              res.status(500).render('signup', {
                  errorMessage: 'Username and email need to be unique. Either username or email is already used.'
              });
          } else {
              next(error);
          }
      });

});

/// LOGIN ///

router.get('/', (req, res) => {
  res.render('index')
});

router.post('/', (req, res) => {
  // console.log('SESSION =====> ', req.session); // req.session === {}

  // find the user by their email
  User.findOne({ email: req.body.email }).then((user) => {

      if (!user) {
          // if user does not exist
          res.render('index', { errorMessage: 'Try with different user credentials or sign up!' })
      } else {

          // check if the password is correct
          if (bcrypt.compareSync(req.body.password, user.passwordHash)) {
              req.session.user = user;
              res.redirect('/recipes')
          } else {
              res.render('index', { errorMessage: 'Incorrect password.' })
          }
      }
  });
});


/// LOGOUT ///
router.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/');
});



module.exports = router;




// TO DO: 

// /profile
// /my-bookmarks


// DONE:

// /  (home page with login form)
// /signup
// /logout