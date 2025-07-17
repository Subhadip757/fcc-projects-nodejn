const mongoose = require('mongoose');

const exerciseSchema = new mongoose.Schema({
  description: String,
  duration: Number,
  date: String
});

const userSchema = new mongoose.Schema({
  username: { type: String, required: true },
  log: [exerciseSchema]
});

module.exports = mongoose.model('User', userSchema);