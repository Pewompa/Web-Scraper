const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');
const myCache = new NodeCache({ stdTTL: 1000, checkperiod: 1209 });

async function getAll(req, res) {
  req.params.page ? (page = req.params.page) : (page = 1);
  let articles = [];

  let articlesNeeded = articles.length - page * 30;

  let cachedValue = myCache.get(page);
  if (cachedValue !== undefined) {
    cachedValue.map((el) => articles.push(el));
  }

  let startingPage = articles.length / 30 + 1;

  if (page === startingPage - 1) {
    console.log('same');
    res.send(articles);
    return;
  } else if (articles.length > articlesNeeded) {
    startingPage = page;
  }

  console.log('articles length: ', articles.length);
  console.log('starting page: ', startingPage);
  console.log('####################################');
  for (let i = startingPage; i <= page; i++) {
    const url = `https://news.ycombinator.com/news?p=${i}`;
    await axios(url)
      .then((response) => {
        const html = response.data;
        const $ = cheerio.load(html);
        $('.athing', html).each(function () {
          const rank = $(this).children('.title').children('.rank').text();
          const title = $(this)
            .children('.title')
            .children('.titlelink')
            .text();
          const url = $(this)
            .children('.title')
            .children('.titlelink')
            .attr('href');
          const site = $(this)
            .children('.title')
            .children('.sitebit')
            .children('a')
            .children('span')
            .text();
          const points = $(this)
            .next('tr')
            .children('.subtext')
            .children('.score')
            .text();
          const username = $(this)
            .next('tr')
            .children('.subtext')
            .children('.hnuser')
            .text();
          const age = $(this)
            .next('tr')
            .children('.subtext')
            .children('.age')
            .text();
          const comments = $(this)
            .next('tr')
            .children('.subtext')
            .children('.age')
            .next('span')
            .next('a')
            .next('a')
            .text();
          articles.push({
            rank,
            title,
            url,
            site,
            points,
            username,
            age,
            comments,
          });
        });
      })

      .catch((err) => console.error(err));
  }
  myCache.set(page, articles, 3000);
  res.send(articles);
}

// Cache middleware
// function cache(req, res, next) {
//   req.params.page ? (page = req.params.page) : (page = 1);
//   let cachedValue = myCache.get(page);
//   if (cachedValue !== undefined) {
//     res.send(cachedValue);
//   } else {
//     next();
//   }
// }

module.exports = { getAll };
