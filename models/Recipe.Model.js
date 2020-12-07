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
    recipeImage: String,
    prepTime: String,
    cookTime: String,
    totalTime: {
      type: String,
      required: true
    },
    typeOfMeal: [String],
    typeOfRecipe: [String],
    portions: Number,
    ingredients:[String],
  
    ratings: [{
      user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
      rating: {
        type: Number,
        required: true
      }
    }],
    avgRating: Number,
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    //bookmarkedBy: [{ type: Schema.Types.ObjectId, ref: 'User' }],
    //numberOfBookmarks: Number,
    createDate: Date,
    level: String
  },
  {
    timestamps: true
  })

module.exports = model('Recipe', recipeSchema);

