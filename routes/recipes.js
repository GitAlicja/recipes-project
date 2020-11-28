
const express = require('express');
const Recipe = require('../models/Recipe.Model');

const router = express.Router();

// /recipes 
router.get('/recipes', (req, res, next) => {
  let MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"];
  Recipe.find().then((recipeFromDB) => {
    // console.log("Meal type ================================>", MealType)
    res.render('welcome', { recipes: recipeFromDB, MealType: MealType })
  });

});


// /:id/details
router.get('/recipes/:id', (req, res, next) => {
  // array of possible scores to rate the recipes
  let possibleScores = [1, 2, 3, 4, 5];
  const { id } = req.params;
  Recipe.findById(id)
    .then(recipeDetails => {
      // passing the array of possibleScores added 
      res.render('details', { recipeDetails, possibleScores });
    })
});


// /:id/save-rating

router.post('/recipes/:id/save-rating', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/');
  } else {

    Recipe.findById(req.params.id).then(recipe => {
      // check first if the user have already rated the recipe
      // 'ratings' is the property name from the Recipes.Model
      // 'user' is the property of the 'ratings' object from the Recipes.Model
      const existingRating = recipe.ratings.find(rating => rating.user == req.session.userId);
      if (existingRating) {
        existingRating.rating = req.body.newRating;
      } else {
        const newRating = { user: req.session.userId, rating: req.body.newRating };
        recipe.ratings.push(newRating);
      }

      recipe.avgRating = recipe.ratings.reduce((sum, entry) => sum + entry.rating, 0) / recipe.ratings.length;

      
      Recipe.update({ _id: recipe._id }, { ratings: recipe.ratings, avgRating: recipe.avgRating })
        .exec()
        .then(() => {

          res.redirect('/recipes/' + req.params.id);
        })


    });
  }
});

// /create-new

router.get('/create', (req, res) => res.render('create'));

//post route to save new recipe to DB ** Removed ingredients and createdBy fields!!**
router.post('/create', (req, res) => {
  console.log(req.body)
  const { name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions } = req.body;

  Recipe.create({ name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients: [req.body.ingredients], userID: req.session.user._id, ratings: [], avgRating: 0 })
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


// /create-new



module.exports = router;
