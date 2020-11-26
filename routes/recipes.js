
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
router.get('/search', (req, response) => {
  console.log("searchInput", req.query.searchInput)
  let query = { name: { $regex: ".*" + req.query.searchInput + ".*" } }
  console.log(query)
  Recipe.find(query).then((recipesFromDB) => {
    console.log(recipesFromDB);
    response.render('recipes-search-results', {recipesFromDB})
  })
})
// /recipes/filteredBy... (?)
// /create-new



module.exports = router;
