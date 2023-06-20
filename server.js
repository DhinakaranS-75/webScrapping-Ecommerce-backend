const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/products/:searchTerm', async (req, res) => {
  try {
    const searchTerm = req.params.searchTerm;
    const url = `https://www.flipkart.com/search?q=${searchTerm}`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const products = [];

    $('._13oc-S').each((index, element) => {
      const name = $(element).find('a').text().trim();
      const price = $(element).find('div[class="_30jeq3 _1_WHN1"]').text().trim();
      const rating = $(element).find('div[class="_3LWZlK"]').text().trim();
      const image = $(element).find('img').attr('src');

      products.push({ name, price, rating, image });
    });

    res.json(products);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
