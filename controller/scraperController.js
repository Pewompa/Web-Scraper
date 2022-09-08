const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

async function getAll(req, res) {
  req.params.page ? (page = req.params.page) : (page = 1);
  let articles = [];
  for (let i = 1; i <= page; i++) {
    const url = `https://news.ycombinator.com/news?p=${i}`;
    await axios(url)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $('.titlelink', html).each(function () {
          const title = $(this).text();
          const url = $(this).attr('href');
          articles.push({ title, url });
        });
      })
      .catch((err) => console.error(err));
  }
  myCache.set(page, articles, 300);
  res.send(articles);
}

// Cache middleware
function cache(req, res, next) {
  req.params.page ? (page = req.params.page) : (page = 1);
  let cachedValue = myCache.get(page);
  if (cachedValue !== undefined) {
    res.send(cachedValue);
  } else {
    next();
  }
}

module.exports = { getAll, cache };
