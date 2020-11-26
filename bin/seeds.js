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
    portions: 1,
    ingredients:
      [{ name: 'frozen raspberries', quantity: 150, unit: 'g' }, { name: 'coconut milk (from a carton, not tinned)', quantity: 100, unit: 'ml' }, { name: 'almond butter', quantity: 1, unit: 'tablespoon' }, { name: 'large frozen banana', quantity: 1, unit: 'piece/s' }, { name: 'coconut chips', quantity: 1, unit: 'handful' }
      ],
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

