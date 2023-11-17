"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { generateDescription } = require('../controllers/openaiController');
const Router = express.Router();
Router.route('/generate').post(generateDescription);
exports.default = Router;
//# sourceMappingURL=openaiRoutes.js.map