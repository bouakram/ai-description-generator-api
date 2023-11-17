const express = require('express');
const { generateDescription } = require('../controllers/openaiController');
const Router = express.Router()

Router.route('/generate').post(generateDescription)

export default Router