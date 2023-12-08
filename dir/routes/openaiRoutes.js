"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const openaiController_1 = require("../controllers/openaiController");
const authMiddleware_1 = __importDefault(require("../middleware/authMiddleware"));
const express = require('express');
const { generateDescription } = require('../controllers/openaiController');
const Router = express.Router();
Router.route('/topic').get(authMiddleware_1.default, openaiController_1.getTopic);
Router.route('/content').get(authMiddleware_1.default, openaiController_1.getContent);
Router.route('/last-content').get(authMiddleware_1.default, openaiController_1.getLastContent);
Router.route('/generate').post(authMiddleware_1.default, generateDescription);
///// TODO: adding new routes for save and remove the generated content
Router.route('/content').post(authMiddleware_1.default, openaiController_1.saveGeneratedContent);
Router.route('/content/:id').delete(authMiddleware_1.default, openaiController_1.deleteContent);
exports.default = Router;
//# sourceMappingURL=openaiRoutes.js.map