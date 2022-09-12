const axios = require('axios');
const cheerio = require('cheerio');
const NodeCache = require('node-cache');
const myCache = new NodeCache();

let previousPage = 0;
async function getAll(req, res) {
  req.params.page ? (page = req.params.page) : (page = 1);
  let articles = [];

  let cachedValue = myCache.get(previousPage);

  //if there is a cache we push its values to the output array
  if (cachedValue !== undefined) {
    cachedValue.map((el) => articles.push(el));
  }
  //check whether we have enough files stored in the cache (previous fetch was bigger than current)
  let articlesNeeded = articles.length - page * 30;

  //setting the page at which axios needs to start fetching from
  let startingPage = articles.length / 30 + 1;

  //if we are loading the same page twice in a row we immediately send what is in the cache
  if (page === startingPage - 1) {
    res.send(articles);
    return;
  } else if (
    //if articles cache has more files than we need that means we have enough files in the cache to send so no need to get with axios
    articles.length &&
    articles.length > articlesNeeded &&
    articlesNeeded > 0
  ) {
    //returning an array that was created by looping through our bigger than needed cache
    let newArr = [];
    for (let i = 0; i < articlesNeeded; i++) {
      newArr.push(articles[i]);
    }
    res.send(newArr);
    return;
  }

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
  myCache.set(page, articles, 300);
  console.log(previousPage);

  previousPage = page;
  res.send(articles);
}

module.exports = { getAll };
