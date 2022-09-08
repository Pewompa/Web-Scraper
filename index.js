const express = require('express');
const app = express();
const port = 4000;
const router = require('./router/scraperRouter');

app.use(router);
app.use(express.json());

app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
