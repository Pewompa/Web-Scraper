const express = require('express');
const scraperRouter = express.Router();
const controller = require('../controller/scraperController');

scraperRouter.get('/', controller.getTest);

module.exports = scraperRouter;
