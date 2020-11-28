
const express = require('express');
const Recipe = require('../models/Recipe.Model');
const User = require('../models/User.Model');
const router = express.Router();

// /recipes 
router.get('/recipes', (req, res, next) => {
  // only looged in user can see this page
  if (!req.session.userId) {
    res.redirect('/'); // redirect to the homepage where the login form is
  } else {
    let MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"]
    let RecipeType = ["vegetarian", "vegan", "gluten-free", "meat", "fish", "seafood", "low-carb"]
    Recipe.find().then((recipeFromDB) => {
      // console.log("Meal type ================================>", MealType)
      res.render('welcome', { recipes: recipeFromDB, MealType: MealType, RecipeType: RecipeType })
    });
  }
});


// /:id/details
router.get('/recipes/:id', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/'); // redirect to the homepage where the login form is
  } else {
    // array of possible scores to rate the recipe
    let possibleScores = [1, 2, 3, 4, 5];
    const { id } = req.params;
    Recipe.findById(id)
      .populate('createdBy')
      .then(recipeDetails => {
        // passing the array of possibleScores added 
        res.render('details', { recipeDetails, possibleScores, selfRatingError: req.query.selfRatingError });
      });
  }
});


// /:id/save-rating
router.post('/recipes/:id/save-rating', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/');
  } else {

    Recipe.findById(req.params.id).then(recipe => {

      if (recipe.createdBy == req.session.userId) {
        res.redirect(`/recipes/${req.params.id}?selfRatingError=true`);
        return;
      }
      // check first if the user has already rated this recipe (is the logged in user same user who has already rated this recipe)
      // 'ratings' is the name of the array with ratings from the Recipes.Model
      // 'user' is the property of a rating in the 'ratings' array from the Recipes.Model
      const existingRating = recipe.ratings.find(rating => rating.user == req.session.userId);
      if (existingRating) {
        // if yes, than replace previous rating with the new one (from the same user)
        existingRating.rating = req.body.newRating;
      } else {
        const newRating = { user: req.session.userId, rating: req.body.newRating };
        // add the new rating to the array with all ratings
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

// router.get('/create', (req, res) => res.render('create', {recipes: recipeFromDB, MealType: MealType }));

router.get('/create', (req, res, next) => {
  let MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"]
  Recipe.find().then((recipeFromDB) => {
    res.render('create', { ingredients: [null, null, null, null], recipes: recipeFromDB, MealType: MealType, })
  })
  // user: userFromDB
});
//post route to save new recipe to DB 
router.post('/create', (req, res) => {
  console.log(req.body)
  const { name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients } = req.body;

  Recipe.create({ name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients, ratings: [], avgRating: 0 })
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

  Recipe.findByIdAndUpdate(id, { name, instructions, URL, image, prepTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients }, { new: true })
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
  Recipe.find({
    $and: [
      { $or: [{ typeOfRecipe: { $in: req.query.typeOfRecipe } }] },
      { $or: [{ typeOfMeal: { $in: req.query.typeOfMeal } }] }
    ]
  }).then((recipesFromDB) => {
    if (recipesFromDB.length === 0) {
      res.send("There are no recipes that meet your criteria. Sorry! :(")
    }
    res.render('recipes-search-results', { recipesFromDB })
  }).catch(error => {
    console.log("something went wrong to get filters fromdb", error)
  })
})





// /create-new



module.exports = router;
