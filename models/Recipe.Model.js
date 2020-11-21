const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const recipeSchema = new Schema(
  {
    name: {
      String,
      required: [true]
    },
    instructions: {
      String,
      required: true
    },
    URL: String,
    image: String,
    prepTime: Number,
    cookTime: Number,
    totalTime: {
      Number,
      required: true
    },
    typeOfMeal: [String],
    typeOfRecipe: [String],
    portions: Number,
    ingredients:
      [
        {
        name: String,
        required: true
      },

      {
        quantity: Number,
        required: true
      },
      {
        unit: String,
        required: true
      },
      ],
  rating: Number,
  createdBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  numberOfBookmarks: Number,
  createDate: Date,
  timestamps: true,
  })

module.exports = model('Recipe', recipeSchema);

