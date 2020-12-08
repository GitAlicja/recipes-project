const mongoose = require('mongoose');
const Recipe = require('../models/Recipe.Model');

const DB_NAME = "recipes-project";

mongoose.connect(`mongodb://localhost/${DB_NAME}`, {
  useCreateIndex: true,
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const recipes = [
  {
    name: 'Berry and Coconut Smoothie Bowl',
    instructions: "Place all of the smoothie bowl ingredients into a blender and pulse until smooth. Once smooth, pour into a bowl and top with coconut chips, raspberries and a drizzle of almond butter.",
    URL: "https://deliciouslyella.com/recipes/berry-coconut-smoothie-bowl/",
    prepTime: 5,
    cookTime: 2,
    totalTime: 7,
    typeOfMeal: ['breakfast', 'dessert'],
    typeOfRecipe: ['vegan', 'healthy', 'quick'],
    recipeImage: "https://deliciouslyella.com/wp-content/uploads/2020/08/18-02-26-SmoothieBowl-15-440x610.jpg",
    portions: 1,
    ingredients:
      [{ name: 'frozen raspberries', quantity: 150, unit: 'g' }, { name: 'coconut milk (from a carton, not tinned)', quantity: 100, unit: 'ml' }, { name: 'almond butter', quantity: 1, unit: 'tablespoon' }, { name: 'large frozen banana', quantity: 1, unit: 'piece/s' }, { name: 'coconut chips', quantity: 1, unit: 'handful' }
      ],
      avgRating: 0,
      ratings: []
    //createDate: Date.parse('2020-11-23')
  },

  {
    name: 'Super Green Pasta',
    instructions: "Preheat oven to 180c, fan setting. Place the courgette on a baking tray with a drizzle of olive oil and salt, cook for 10 minutes. After 10 minutes, add the garlic and roast for another 5-10 minutes until golden, before removing from the oven and leaving to one side. Put the pasta in a pan of boiling water and cook to the instructions on the pack. Once cooked, drain and leave to one side. Place the almond milk, spinach and salt in a pan over a medium heat and cook until the spinach has wilted. Once wilted, add the roasted garlic and blend using a hand blender (or pour the sauce into a normal blender) until smooth - if you’re adding nutritional yeast, add it to your blender now. Mix through the courgettes and peas, and cook for another 5 minutes. Finally, stir the lemon juice through through the pasta before serving.",
    URL: "https://deliciouslyella.com/recipes/super-green-pasta/",
    prepTime: 10,
    cookTime: 15,
    totalTime: 25,
    typeOfMeal: ['dinner', 'lunch'],
    typeOfRecipe: ['vegan', 'quick', 'healthy'],
    portions: 2,
    ingredients:
      [{ name: 'pasta', quantity: 2, unit: 'portions' }, { name: 'courgette', quantity: 1, unit: 'piece/s' }, { name: 'garlic cloves', quantity: 2, unit: 'piece/s' }, { name: 'lemon juice', quantity: 0.5, unit: 'lemon' }, { name: 'spinach', quantity: 200, unit: 'g' }, { name: 'almond milk', quantity: 125, unit: 'ml' }, { name: 'peas, frozen or fresh', quantity: 150, unit: 'g' }, { name: 'olive oil', quantity: 1, unit: 'teaspoon' }, { name: 'sea salt', quantity: 1, unit: 'pinch' }
      ],
      avgRating: 0,
      ratings: []
    //createDate: Date.parse('2020-11-23')
  },


  {
    name: 'Greek Fava Dip',
    instructions: "1. Sauté the onion and garlic. Heat 1 tablespoon olive oil in a large saucepan over medium-high heat.  Add the red onion and sauté for 5 minutes, stirring occasionally.  Add the garlic and sauté for 1-2 minutes, stirring frequently, until fragrant. 2. Simmer. Add the water, yellow split peas, bay leaf, salt, cumin and stir to combine.  Continue cooking until the mixture reaches a simmer.  Then reduce the heat to medium-low and simmer for 20-25 minutes, until the yellow split peas have completely softened. 3. Purée. Discard the bay leaf.  Then, using an immersion blender (or see alternatives below), purée the mixture until smooth. 4. Season. Remove saucepan from heat.  Stir in the lemon juice and remaining 2 tablespoons olive oil until combined.  Then taste the dip, and season with extra salt and/or lemon juice if needed.  The fava will thicken considerably as it cools. 5. Serve. Garnish with a pinch of smoked paprika and any other preferred toppings, then serve and enjoy!  Leftovers can be refrigerated in a sealed container for up to 3-4 days.",
    URL: "https://www.gimmesomeoven.com/greek-fava/#tasty-recipes-73436",
    prepTime: 10,
    cookTime: 30,
    totalTime: 40,
    typeOfMeal: ['snack', 'lunch'],
    typeOfRecipe: ['vegan', 'quick', 'healthy'],
    recipeImage: "https://www.gimmesomeoven.com/wp-content/uploads/2020/07/Greek-Fava-Dip-Recipe-1-2.jpg",
    portions: 4,
    ingredients:
      ["3 tablespoons olive oil, divided", "1 small red onion, peeled and diced","3 cloves garlic, minced", "2 1/4 cups water",
      " cup yellow split peas, rinsed and drained", "1 bay leaf", "1 teaspoon fine sea salt",
      "1/2 teaspoon ground cumin",
      "2 tablespoons lemon juice",
      "topping ideas: smoked paprika, extra drizzle of olive oil, sliced (or minced) red onion, Kalamata olives, and/or capers" ],
      avgRating: 0,
      ratings: []
    //createDate: Date.parse('2020-11-23')
  },

];

Recipe.create(recipes)
  .then(recipesFromDB => {
    console.log(`Created ${recipesFromDB.length} recipes`);

    // Once created, close the DB connection
    mongoose.connection.close();
  })
  .catch(err => console.log(`An error occurred while creating recipes from the DB: ${err}`));

