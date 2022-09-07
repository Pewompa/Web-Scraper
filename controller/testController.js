const axios = require('axios');
const cheerio = require('cheerio');
const redis = require('redis');
const client = redis.createClient(6000);

client.connect();
client.on('connect', () => {
  console.log('connected');
});

async function getAll(req, res) {
  let { page } = req.params;
  let num = page;
  client.get(page, (error, data) => {
    console.log('two');
    if (error) {
      throw error;
    }
    if (data !== null) {
      return res.send(data);
    } else {
      for (let i = 1; i <= num; i++) {
        const url = `https://news.ycombinator.com/news?p=${i}`;
        axios(url)
          .then((response) => {
            const html = response.data;
            const $ = cheerio.load(html);
            let articles = [];

            $('.titlelink', html).each(function () {
              const title = $(this).text();
              const url = $(this).attr('href');
              articles.push({ title, url });
              client.setEx(page, 300, JSON.stringify(articles));
            });

            res.send(articles);
          })
          .catch((err) => console.error(err));
      }
    }
  });
}
function cache(req, res, next) {
  console.log('one');
  const { page } = req.params;
  client.get(page, (error, data) => {
    console.log('two');
    if (error) throw error;
    if (data !== null) {
      res.send(data);
    } else {
      next();
    }
  });
}
module.exports = { getAll, cache };
