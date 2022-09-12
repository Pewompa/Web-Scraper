const express = require('express');
const scraperRouter = express.Router();
const controller = require('../controller/scraperController');

scraperRouter.get('/:page?', controller.getAll);

module.exports = scraperRouter;
