const express = require('express');
const router = express.Router();

const User = require('../models/User.Model');
const Recipe = require('../models/Recipe.Model');


// GET /user/profile

router.get('/profile', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/');
  } else {
    // userId is the name of the property (of the object session) in the database
    User.findById(req.session.userId).then(userFromDB => {
      Recipe.find({ createdBy: req.session.userId }, null, { sort: { createdAt: 0 } }).then(recipesFromDB => {
        console.log({ user: userFromDB, recipes: recipesFromDB }) // this is one object
        res.render('user/profile', { user: userFromDB, recipes: recipesFromDB });
      });
    });
  }
});

// GET /user/profile/edit

router.get('/profile/edit', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/');
  } else {
    User.findById(req.session.userId).then(userFromDB => {
      res.render('user/edit', userFromDB)
    });
  }
});

// POST /user/profile/edit

router.post('/profile/edit', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/');
  } else {

    // make sure fields are not empty
    if (!req.body.username || req.body.username.trim().length === 0 || !req.body.email || req.body.email.trim().length === 0) {
      res.render('user/edit', { username: req.body.username, email: req.body.email, errorMessage: 'All fields are mandatory. Please provide your username and email.' });
      return;
    }

    User.findByIdAndUpdate(req.session.userId, { username: req.body.username.trim(), email: req.body.email.trim() }).then(() => {
      res.redirect('/user/profile');
    })
      .catch(error => {
        if (error.code === 11000) {
          res.status(500).render('user/edit', {
            errorMessage: 'Username and email need to be unique. Either username or email is already used.'
          });
        } else {
          next(error);
        }
      });
  }
});


// GET /user/bookmarks

router.get('/bookmarks', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/');
  } else {
    User.findById(req.session.userId)
    //.populate('bookmarkedRecipes')
    .populate({
      path: 'bookmarkedRecipes',
      populate: {path: 'createdBy'}
    })
    .then(userFromDB => {
      res.render('user/bookmarks', userFromDB)
    });
  }
});

module.exports = router; 