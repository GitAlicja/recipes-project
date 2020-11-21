
const express = require('express');
const recipe = require('../models/Recipe.model');
const router = express.Router();

// /all-recipes 
router.get('/recipes', (req, res, next) => {

  recipe.find().then((recipeFromDB) => {
    console.log(recipeFromDB)
    res.render('welcome', { recipes: recipeFromDB })
  })

});



// /:id/edit
// /:id/details
// /all-recipes/filteredBy... (?)
// /create-new



module.exports = router;
