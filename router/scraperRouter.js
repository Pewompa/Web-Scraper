const express = require('express');
const scraperRouter = express.Router();
const controller = require('../controller/scraperController');

scraperRouter.get('/:page', controller.cache, controller.getAll);
scraperRouter.get('/', controller.getHome);

module.exports = scraperRouter;
