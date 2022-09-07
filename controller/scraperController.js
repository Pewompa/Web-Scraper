const axios = require('axios');
const cheerio = require('cheerio');

const getTest = (req, res) => {
  const { page } = req.params;
  const url = `https://news.ycombinator.com/news?p=${page}`;

  axios(url)
    .then((response) => {
      const html = response.data;
      const $ = cheerio.load(html);
      const articles = [];

      $('.titlelink', html).each(function () {
        const title = $(this).text();
        const url = $(this).attr('href');
        articles.push({ title, url });
      });
      res.send(articles);
    })
    .catch((err) => console.log(err));
};
// const getTest = (req, res) =>
//   axios(url)
//     .then((response) => {
//       const html = response.data;
//       const $ = cheerio.load(html);
//       const articles = [];

//       $('.titlelink', html).each(function () {
//         const title = $(this).text();
//         const url = $(this).attr('href');
//         articles.push({ title, url });
//       });
//       res.send(articles);
//     })
//     .catch((err) => console.log(err));

module.exports = { getTest };
