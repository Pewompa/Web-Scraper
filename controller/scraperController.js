const axios = require('axios');
const cheerio = require('cheerio');

// const getTest = (req, res) => {
//   let { page } = req.params;
//   let numo = page;
// };
// const articles = [];
// for (let i = 1; i <= num; i++) {
//   const url = `https://news.ycombinator.com/news?p=${i}`;
//   axios(url)
//     .then((response) => {
//       const html = response.data;
//       const $ = cheerio.load(html);

//       $('.titlelink', html).each(function () {
//         const title = $(this).text();
//         const url = $(this).attr('href');
//         articles.push({ title, url });
//       });
//       //   res.send(articles);
//       console.log(`page: ${i}`);
//       console.log(articles);
//     })
//     .catch((err) => console.log(err));
// }
async function getTest(req, res) {
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
  console.log(result.length);
  res.send(result);
}

module.exports = { getTest };
