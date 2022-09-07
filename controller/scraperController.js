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
  let articles = [];

  for (let i = 1; i < num + 1; i++) {
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
        client.setEx(page, 300, JSON.stringify(articles));
      })
      .catch((err) => console.error(err));
  }

  function limit(arr, num) {
    let output = [];
    let i = 0;
    while (output.length < num * 30) {
      output.push(arr[i]);
      i++;
    }
    return output;
  }

  let result = limit(articles, num);

  client.setEx(page, 300, JSON.stringify(articles));

  res.send(result);
  // res.send(setResponse(page, articles));
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

function getHome(req, res) {
  const url = `https://news.ycombinator.com/`;
  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      let articles = [];
      $('.titlelink', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr('href');
        articles.push({ title, url });
      });

      res.send(articles);
    })
    .catch((err) => console.error(err));
}

module.exports = { getAll, getHome, cache };
