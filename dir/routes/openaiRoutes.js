"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const { generateDescription } = require('../controllers/openaiController');
const Router = express.Router();
Router.route('/generate').post(generateDescription);
// TODO: adding new routes for save and remove the generated content
// Router.route('/generate/content').post(saveGeneratedContent).delete(deleteGeneratedContent)
exports.default = Router;
//# sourceMappingURL=openaiRoutes.js.map