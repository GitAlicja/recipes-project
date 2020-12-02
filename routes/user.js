const express = require('express');
const router = express.Router();
const User = require('../models/User.Model');
const Recipe = require('../models/Recipe.Model');
const fileUploader = require('../configs/cloudinary.config');
const { route } = require('./recipes');

const MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"];
const RecipeType = ["vegetarian", "vegan", "gluten-free", "meat", "fish", "seafood", "low-carb"];

// GET /user/profile

router.get('/profile', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/');
  } else {
    // userId is the name of the property (of the object session) in the database
    // find the user who is logged in
    User.findById(req.session.userId).then(userFromDB => {

      let recipesPromise;

      // if the query IS set
      if (req.query.query) {
        recipesPromise = Recipe.find({
          $and: [
            { createdBy: req.session.userId }, { $or: [{ name: new RegExp(req.query.query, "i") }, { instructions: new RegExp(req.query.query, "i") }] }]
        }, null, { sort: { createdAt: 0 } });
      }

      // user recipes filter by tag
      else if (req.query.typeOfRecipe || req.query.typeOfMeal) {
        // console.log("req.query.typeOfRecipe", req.query.typeOfRecipe)
        // console.log("req.query.typeOfMeal", req.query.typeOfMeal)
        const filterByRecipeType = req.query.typeOfRecipe ? req.query.typeOfRecipe : RecipeType
        const filterByMealType = req.query.typeOfMeal ? req.query.typeOfMeal : MealType
        recipesPromise = Recipe.find({
          $and: [
            { createdBy: req.session.userId },
            { typeOfRecipe: { $in: filterByRecipeType } },
            { typeOfMeal: { $in: filterByMealType } }
          ]
        });
      }

      // if the query and filters ARE NOT set find all recipes created by the user
      else {
        recipesPromise = Recipe.find({ createdBy: req.session.userId }, null, { sort: { createdAt: 0 } });
      }

      recipesPromise.then(recipesFromDB => {
        // console.log({ user: userFromDB, recipes: recipesFromDB }) this is one object with two properties
        res.render('user/profile', { query: req.query.query, user: userFromDB, recipes: recipesFromDB, MealType: MealType, RecipeType: RecipeType });
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
// image is a parameter, the name attribute of the input field with the type of file
router.post('/profile/edit', fileUploader.single('image'), (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/');
  } else {

    // make sure fields are not empty
    if (!req.body.username || req.body.username.trim().length === 0 || !req.body.email || req.body.email.trim().length === 0) {
      res.render('user/edit', { username: req.body.username, email: req.body.email, errorMessage: 'All fields are mandatory. Please provide your username and email.' });
      return;
    }

    User.findByIdAndUpdate(req.session.userId, { username: req.body.username.trim(), email: req.body.email.trim(), profileImg: req.file.path }).then(() => {
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

    let queryMatch = undefined;
    if (req.query.query) {
      queryMatch = { $or: [{ name: new RegExp(req.query.query, "i") }, { instructions: new RegExp(req.query.query, "i") }] };
    }
    User.findById(req.session.userId)
      //.populate('bookmarkedRecipes')
      .populate({
        path: 'bookmarkedRecipes',
        populate: { path: 'createdBy' },
        match: queryMatch
      })
      .then(userFromDB => {
        res.render('user/bookmarks', { query: req.query.query, user: userFromDB })
      });
  }
});


// GET /user/shopping-list

router.get('/shopping-list', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/');
  } else {
    User.findById(req.session.userId)
      .populate('shoppingList')
      .then(userFromDB => {
        res.render('user/shopping-list', userFromDB);
      });
  }

});


// POST /user/shopping-list/add/:id

router.post('/shopping-list/:id/add', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/');
  } else {

    /*
// test if id set / valid

    // test if exists


    Recipe.findById(req.params.id).then(r => {}).catch(e => {
      // not found
    }) 
    
    
    
    
    */

    User.findById(req.session.userId).then(userFromDB => {
      // id the array shoppingList DOES NOT include this recipe ID, add the ID to it 
      if (!userFromDB.shoppingList.includes(req.params.id)) {
        userFromDB.shoppingList.push(req.params.id);
      }
      // update user in the database 
      User.update({_id: userFromDB._id}, { shoppingList: userFromDB.shoppingList })
      .exec()
      .then(() => {
        res.redirect('/user/shopping-list');
      });
    });
  }
});

module.exports = router; 