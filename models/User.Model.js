const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    bookmarkedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    //createdRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
  },{
    timestamps: true
  });

module.exports = model('User', userSchema);