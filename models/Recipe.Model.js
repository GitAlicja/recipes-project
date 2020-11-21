const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const recipeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true]
    },
    instructions: {
      type: String,
      required: true
    },
    URL: String,
    image: String,
    prepTime: Number,
    cookTime: Number,
    totalTime: {
      type: Number,
      required: true
    },
    typeOfMeal: [String],
    typeOfRecipe: [String],
    portions: Number,
    ingredients:
      [{
        name: {
          type: String,
          required: true
        },

        quantity: {
          type: Number,
          required: true
        },

        unit: {
          type: String,
          required: true
        },
      }],
    rating: Number,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    //bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    //numberOfBookmarks: Number,
    //createDate: Date,
  }, {
    timestamps: true
  })

module.exports = model('Recipe', recipeSchema);

