const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const userSchema = new Schema(
  {
    username: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.'],
      unique: true,
      lowercase: true,
      trim: true
    },
    passwordHash: {
      type: String,
      required: true
    },
    bookmarkedRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    //createdRecipes: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }],
    profileImg: String,
    shoppingList: [{ type: Schema.Types.ObjectId, ref: 'Recipe' }]
  },
  {
    timestamps: true
  }
);

module.exports = model('User', userSchema);