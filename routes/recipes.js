
const express = require('express');
const Recipe = require('../models/Recipe.Model');
const User = require('../models/User.Model')
const router = express.Router();
const fileUploader = require('../configs/cloudinary.config');

let MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"]
let RecipeType = ["vegetarian", "vegan", "gluten-free", "meat", "fish", "seafood", "low-carb"]

// array of possible scores to rate the recipe
const possibleScores = [1, 2, 3, 4, 5];


// /recipes 
router.get('/recipes', (req, res, next) => {

  // only logged in user can see this page
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    // let MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"]
    // let RecipeType = ["vegetarian", "vegan", "gluten-free", "meat", "fish", "seafood", "low-carb"]
    Recipe.find().then((recipeFromDB) => {

      User.findById(req.session.userId).then((user) => {
        res.render('welcome', { recipes: recipeFromDB, MealType: MealType, RecipeType: RecipeType, user })
      });
    });
  }
});


// /recipes/create

// router.get('recipes/create', (req, res) => res.render('create', {recipes: recipeFromDB, MealType: MealType }));

router.get('/recipes/create', (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    let MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"]
    let RecipeType = ["vegetarian", "vegan", "gluten-free", "meat", "fish", "seafood", "low-carb"]

    Recipe.find()
      .populate('createdBy')
      .then((recipeFromDB) => {
        res.render('create', { ingredients: [null, null, null, null, null, null, null, null], recipes: recipeFromDB, MealType: MealType, RecipeType: RecipeType })
      })
    // user: userFromDB
  }
});

// //post route to save new recipe to DB 
// router.post('/recipes/create', fileUploader.single('image'), (req, res) => {
//   // console.log(req.body)
//   const { name, instructions, URL, image, prepTime, cookTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients } = req.body;

//   Recipe.create({ name, instructions, URL, image, prepTime, cookTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients, ratings: [], avgRating: 0, createdBy: req.session.userId, })
//     .then(() => res.redirect('/recipes'))
// });
// // recipeImage: req.file.path 

router.post('/recipes/create', fileUploader.single('image'), (req, res) => {
  if (!req.file) {
    res.send("file not found")
  }
  const { name, instructions, URL, prepTime, cookTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients } = req.body;

  Recipe.create({ name, instructions, URL, prepTime, cookTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients, ratings: [], avgRating: 0, createdBy: req.session.userId, recipeImage: req.file.path })
    .then(() => res.redirect('/recipes'))
});



// /:id/details
router.get('/recipes/:id', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/'); // redirect to the homepage where the login form is
  } else {
    const { id } = req.params;
    Recipe.findById(id)
      .populate('createdBy')
      .then(recipeDetails => {
        // passing the array of possibleScores added 
        res.render('details', { recipeDetails, possibleScores, selfRatingError: req.query.selfRatingError });
      });
  }
});



///:id/save-bookmarks >>> missing: should only be able to add to bookmarks ONCE per recipe
router.post('/recipes/:id/save-bookmark', (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/'); // redirect to the homepage where the login form is
  } else {
    User.findById(req.session.userId).then(user => {
      const newBookmark = req.params.id;
      // console.log(">>>>>>>>>>>>>>>>>bookmark: ", newBookmark)
      // console.log(">>>>>>>>>>>>>>>>>>>user: ", user)
      // add the new bookmark to the array with all the user's bookmarks
      if (!user.bookmarkedRecipes.includes(newBookmark)) {
        user.bookmarkedRecipes.push(newBookmark);
        user.save().then(
          res.redirect('/user/bookmarks'))
      }
      else { res.redirect('/user/bookmarks') };
    })
  }
})


// /:id/remove-bookmarks
router.post('/recipes/:id/remove-bookmark', (req, res, next) => {
  if (!req.session.userId) {
    res.redirect('/'); // redirect to the homepage where the login form is
  } else {
    User.findById(req.session.userId).then(user => {
      const bookmarkedRecipes = user.bookmarkedRecipes
      const bookmarkToBeRemoved = req.params.id;
      // console.log(">>>>>>>>>>>>>>>>>bookmark: ", bookmarkToBeRemoved)
      // console.log(">>>>>>>>>>>>>>>>>>>user: ", user)
      const index = bookmarkedRecipes.indexOf(bookmarkToBeRemoved)
      if (index > -1) { bookmarkedRecipes.splice(index, 1) }
      user.save().then(
        res.redirect('/user/bookmarks')
      );
    })
  }
})


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

      // // 1st version
      // let found = false;
      // for (let i = 0; i < possibleScores.length; i++) {
      //   let score = possibleScores[i];
      //   found = found || score == req.body.newRating;
      //   // example: false || 1 == "6"
      // }


      // // 2nd version
      // if (!possibleScores.includes(req.body.newRating)) {
      //   res.redirect('/recipes/' + req.params.id);
      //   return;
      // }

      // 3rd version
      const validValue = possibleScores.reduce((found, score) => found || score == req.body.newRating, false);

      if (!validValue) {
        res.redirect('/recipes/' + req.params.id);
        return;
      }

      // check first if the user has already rated this recipe (is the logged in user same user who has already rated this recipe)
      // 'ratings' is the name of the array with ratings from the Recipes.Model
      // 'user' is the name of the property of a single rating in the 'ratings' array from the Recipes.Model
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

// // /create-new

// // router.get('/create', (req, res) => res.render('create', {recipes: recipeFromDB, MealType: MealType }));

// router.get('/create', (req, res, next) => {
//   if (!req.session.userId) {
//     res.redirect('/');
//   } else {
//     let MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"]
//     let RecipeType = ["vegetarian", "vegan", "gluten-free", "meat", "fish", "seafood", "low-carb"]

//     Recipe.find()
//       .populate('createdBy')
//       .then((recipeFromDB) => {
//         res.render('create', { ingredients: [null, null, null, null], recipes: recipeFromDB, MealType: MealType, RecipeType: RecipeType })
//       })
//     // user: userFromDB
//   }
// });
// //post route to save new recipe to DB 
// router.post('/create', fileUploader.single('image'), (req, res) => {
//   if (!req.file) {
//     res.send("file not found")
//   }
//   const { name, instructions, URL, image, prepTime, cookTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients } = req.body;

//   Recipe.create({ name, instructions, URL, image, prepTime, cookTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients, ratings: [], avgRating: 0, createdBy: req.session.userId, recipeImage: req.file.path })
//     .then(() => res.redirect('/recipes'))
// });

// recipeImage: req.file.path 


// /:id/edit
//How to give permission to the creator of the recipe??//
// req.session.userID != recipes.createdBy)

router.get('/recipes/:id/edit', (req, res, next) => {

  if (!req.session.userId) {
    res.redirect('/');
  }
  else {
    let MealType = ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"]
    let RecipeType = ["vegetarian", "vegan", "gluten-free", "meat", "fish", "seafood", "low-carb"]

    const { id } = req.params
    Recipe.findById(id).then(recipeToEdit => {
      if (req.session.userId != recipeToEdit.createdBy) {
        res.render('details', { errorMessage: 'You do not have permission to edit this recipe' })
      } else {
        // ["breakfast", "lunch", "dinner", "soup", "snacks", "dessert", "cake"]
        // [{ name: "breakfast", selected: true }, { name: "lunch", selected: true }, "dinner", "soup", "snacks", "dessert", "cake"]
        let mealTypesInclSelected = MealType.map((el) => {
          return {
            name: el,
            selected: recipeToEdit.typeOfMeal.includes(el)
          }
        })
        let recipeTypesInclSelected = RecipeType.map((el) => {
          return {
            name: el,
            selected: recipeToEdit.typeOfRecipe.includes(el)
          }
        })
        res.render('edit', { recipeToEdit: recipeToEdit, MealType: mealTypesInclSelected, RecipeType: recipeTypesInclSelected })
      }
    })
  }
});

router.post('/recipes/:id/edit', fileUploader.single('image'), (req, res) => {
  const { id } = req.params;
  const { name, instructions, URL, prepTime, cookTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients } = req.body;

  Recipe.findByIdAndUpdate(id, { name, instructions, URL, prepTime, cookTime, totalTime, typeOfMeal, typeOfRecipe, portions, ingredients, recipeImage: req.file.path }, { new: true })
    .then(() => res.redirect('/recipes'))
});

//:id/delete
router.post('/recipes/:id/delete', (req, res) => {
  if (!req.session.userId) {
    res.redirect('/');
  } else {
    const { id } = req.params;
    Recipe.findByIdAndDelete(id)
      .then(recipeToDelete => {
        if (req.session.userId != recipeToDelete.createdBy) {
          res.render('details', { recipeToDelete: recipeToDelete, errorMessage1: 'You do not have permission to delete this recipe' })
        } else {
          res.redirect('/recipes')
        }
      })
  }
});


// /all-recipes/filteredBy... (?)

router.get('/search', (req, response) => {
  // console.log("searchInput", req.query.searchInput)
  // let query = { name: { $regex: ".*" + req.query.searchInput + ".*" } }
  let query = { $or: [{ name: new RegExp(req.query.searchInput, "i") }, { instructions: new RegExp(req.query.searchInput, "i") }] }
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
    // if (recipesFromDB.length === 0) {
    //   res.send("There are no recipes that meet your criteria. Sorry! :(")
    // }
    res.render('recipes-search-results', { recipesFromDB })
  }).catch(error => {
    console.log("something went wrong to get filters fromdb", error)
  })
})


module.exports = router;
