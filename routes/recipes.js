
const express = require('express');
const Recipe = require('../models/Recipe.Model');
const router = express.Router();

// /recipes 
router.get('/recipes', (req, res, next) => {

  Recipe.find().then((recipeFromDB) => {
    // console.log(recipeFromDB)
    res.render('welcome', { recipes: recipeFromDB })
  })

});


// /:id/details
router.get('/recipes/:id', (req, res, next) => {
  const { id } = req.params;
  Recipe.findById(id)
    .then(recipeDetails => {
      res.render('details', recipeDetails);
    })
});



// /:id/edit
// /recipes/filteredBy... (?)
// /create-new



module.exports = router;
