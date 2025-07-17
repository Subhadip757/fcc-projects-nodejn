const express = require('express');
const cors = require('cors');
const dns = require('dns');
require('dotenv').config();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Url = require('./models/url');

const app = express();
const PORT = 3000;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('public'));

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

let counter = 1;
app.post('/api/shorturl', async (req, res) => {
  const originalUrl = req.body.url;

  try {
    const urlObj = new URL(originalUrl);
    dns.lookup(urlObj.hostname, async (err) => {
      if (err) return res.json({ error: 'invalid url' });

      const existing = await Url.findOne({ original_url: originalUrl });
      if (existing) return res.json(existing);

      const shortUrl = counter++;
      const newUrl = new Url({ original_url: originalUrl, short_url: shortUrl });
      await newUrl.save();

      res.json({ original_url: originalUrl, short_url: shortUrl });
    });
  } catch (e) {
    res.json({ error: 'invalid url' });
  }
});

app.get('/api/shorturl/:short_url', async (req, res) => {
  const short_url = parseInt(req.params.short_url);

  const urlData = await Url.findOne({ short_url });
  if (!urlData) return res.status(404).send('URL not found');

  res.redirect(urlData.original_url);
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});