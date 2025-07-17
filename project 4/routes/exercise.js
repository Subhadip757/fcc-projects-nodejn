const express = require('express');
const router = express.Router();
const User = require('../models/User');

// POST /api/users - create user
router.post('/users', async (req, res) => {
  const { username } = req.body;
  const user = new User({ username });
  await user.save();
  res.json({ username: user.username, _id: user._id });
});

// GET /api/users - get all users
router.get('/users', async (req, res) => {
  const users = await User.find({}, '_id username');
  res.json(users);
});

// POST /api/users/:_id/exercises
router.post('/users/:_id/exercises', async (req, res) => {
  const { description, duration, date } = req.body;
  const user = await User.findById(req.params._id);

  if (!user) return res.send('User not found');

  const exerciseDate = date ? new Date(date) : new Date();
  const formattedDate = exerciseDate.toDateString();

  const exercise = {
    description,
    duration: parseInt(duration),
    date: formattedDate
  };

  user.log.push(exercise);
  await user.save();

  res.json({
    _id: user._id,
    username: user.username,
    date: formattedDate,
    duration: parseInt(duration),
    description
  });
});

// GET /api/users/:_id/logs
router.get('/users/:_id/logs', async (req, res) => {
  const { from, to, limit } = req.query;
  const user = await User.findById(req.params._id);

  if (!user) return res.send('User not found');

  let log = user.log;

  if (from) {
    const fromDate = new Date(from);
    log = log.filter(e => new Date(e.date) >= fromDate);
  }

  if (to) {
    const toDate = new Date(to);
    log = log.filter(e => new Date(e.date) <= toDate);
  }

  if (limit) {
    log = log.slice(0, parseInt(limit));
  }

  res.json({
    username: user.username,
    count: log.length,
    _id: user._id,
    log
  });
});

module.exports = router;