const express = require('express');
const scraperRouter = express.Router();
const controller = require('../controller/scraperController');

scraperRouter.get('/:page?', controller.cache, controller.getAll);

module.exports = scraperRouter;
