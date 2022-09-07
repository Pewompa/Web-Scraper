const express = require('express');
const scraperRouter = express.Router();
// const controller = require('../controller/scraperController');
const controller = require('../controller/testController');

// scraperRouter.get('/:page', controller.getAll);
scraperRouter.get('/:page', controller.getAll);
// scraperRouter.get('/', controller.getHome);

module.exports = scraperRouter;
