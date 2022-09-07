const express = require('express');
const scraperRouter = express.Router();
const controller = require('../controller/scraperController');

scraperRouter.get('/:page', controller.getTest);

module.exports = scraperRouter;
