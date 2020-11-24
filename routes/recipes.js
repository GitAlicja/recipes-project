
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
// /:id/details

router.get('/recipes/:id', (req, res, next) => {
  const { id } = req.params;
  recipe.findById(id)
    .then(recipeDetails => {
      res.render('details', recipeDetails);
    })
});



// /:id/edit
// /all-recipes/filteredBy... (?)
router.get('/search', (req, response) => {
  console.log("searchInput", req.query.searchInput)
  let query = { name: { $regex: ".*" + req.query.searchInput + ".*" } }
  console.log(query)
  recipe.find(query).then((recipesFromDB) => {
    console.log(recipesFromDB);
    response.render('recipes-search-results', {recipesFromDB})
  })
})
// /create-new



module.exports = router;
