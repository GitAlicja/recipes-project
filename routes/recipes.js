
const express = require('express');
const Recipe = require('../models/Recipe.Model');
const router = express.Router();

// /recipes 
router.get('/recipes', (req, res, next) => {

  Recipe.find().then((recipeFromDB) => {
<<<<<<< HEAD
    console.log(recipeFromDB)
=======
    // console.log(recipeFromDB)
>>>>>>> 0f6b88fe4dd87e0457f93ce7560b7be32d78844f
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

// /create-new

router.get('/create', (req, res) => res.render('create'));

//post route to save new recipe to DB ** Removed ingredients and createdBy fields!!**
router.post('/create', (req, res) => {
  console.log(req.body)
  const { name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions, rating } = req.body;

  Recipe.create({ name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients: [req.body.ingredients], rating, userID: req.session.user._id })
    .then(() => res.redirect('/recipes'))
});

// /:id/edit

//How to give permission to the creator of the recipe??//

router.get('/recipes/:id/edit', (req, res, next) => {
  // if (!req.session.user && createdBy._id === req.session.user) {
  //   res.redirect('/login');
  // } else {
  const { id } = req.params
  Recipe.findById(id).then(recipeToEdit => {
    res.render('edit', recipeToEdit)
  })

});

router.post('/recipes/:id/edit', (req, res) => {
  const { id } = req.params;
  const { name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions, rating } = req.body;

  Recipe.findByIdAndUpdate(id, { name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions, rating }, { new: true })
    .then(() => res.redirect('/recipes'))

});

//:id/delete

router.post('/recipes/:id/delete', (req, res) => {
  const { id } = req.params;
 
  Recipe.findByIdAndDelete(id)
    .then(() => res.redirect('/recipes'))
});



// /all-recipes/filteredBy... (?)

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
