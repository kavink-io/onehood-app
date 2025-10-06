const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PostSchema = new Schema({
  content: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
  },
  // This creates a relationship between this Post and a User
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User', // This refers to our 'User' model
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Post', PostSchema);