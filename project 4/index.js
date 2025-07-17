// server.js
const express = require('express');
const app = express();
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const exerciseRoutes = require('./routes/exercise');

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

app.use(cors());
app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html');
});

app.use('/api', exerciseRoutes);

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port);
});