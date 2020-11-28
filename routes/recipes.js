
const express = require('express');
const Recipe = require('../models/Recipe.Model');
const User = require('../models/User.Model');
const router = express.Router();

// /recipes 
router.get('/recipes', (req, res, next) => {
  // if (!req.session.user) {
  //  res.redirect('/login');
  // } else {
  let MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"]
  Recipe.find().then((recipeFromDB) => {
    console.log("Meal type ================================>", MealType)
    res.render('welcome', { recipes: recipeFromDB, MealType: MealType })
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

// router.get('/create', (req, res) => res.render('create', {recipes: recipeFromDB, MealType: MealType }));

router.get('/create', (req, res, next) => {
  let MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"]
  Recipe.find().then((recipeFromDB) => {
    // console.log("Meal type ================================>", MealType)
    res.render('create', { recipes: recipeFromDB, MealType: MealType })
  })

});
//post route to save new recipe to DB 
router.post('/create', (req, res) => {
   console.log(req.body)
  const { name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions, rating } = req.body;

  Recipe.create({ name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients: [req.body.ingredients], rating })
    .then(() => res.redirect('/recipes'))
});

// userID: req.session.user._id

// /:id/edit

//How to give permission to the creator of the recipe??//

router.get('/recipes/:id/edit', (req, res, next) => {
  // if (!req.session.user && createdBy._id === req.session.user) {
  //   res.redirect('/login');
  // } else {
  let MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"]
  const { id } = req.params
  Recipe.findById(id).then(recipeToEdit => {
    res.render('edit', { recipeToEdit: recipeToEdit, MealType: MealType })
  })
});

router.post('/recipes/:id/edit', (req, res) => {
  const { id } = req.params;
  const { name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients } = req.body;

  Recipe.findByIdAndUpdate(id, { name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions }, { new: true })
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
  // console.log("searchInput", req.query.searchInput)
  let query = { name: { $regex: ".*" + req.query.searchInput + ".*" } }
  // console.log(query)
  Recipe.find(query).then((recipesFromDB) => {
    // console.log(recipesFromDB);
    response.render('recipes-search-results', { recipesFromDB })
  })
})
// /recipes/filteredBy... (?)
router.get('/filter', (req, res) => {
  Recipe.find({ typeOfMeal: { $in: req.query.typeOfMeal } }).then((recipesFromDB) => {
    if (recipesFromDB.length === 0) {
      res.send("there is nothing base on ur filter")
    }
    console.log("pleaseee worrrrrkkkkk", recipesFromDB)
    res.render('recipes-search-results', { recipesFromDB })
  }).catch(error => {
    console.log("something went wrong to get filters fromdb", error)
  })
})





module.exports = router;
