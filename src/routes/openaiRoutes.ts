import { deleteContent, getContent, getLastContent, getTopic, saveGeneratedContent } from "../controllers/openaiController";
import protectUser from "../middleware/authMiddleware";

const express = require('express');
const { generateDescription } = require('../controllers/openaiController');
const Router = express.Router()

Router.route('/topic').get(protectUser, getTopic)
Router.route('/content').get(protectUser, getContent)
Router.route('/last-content').get(protectUser, getLastContent)
Router.route('/generate').post(protectUser, generateDescription)
///// TODO: adding new routes for save and remove the generated content
Router.route('/content').post(protectUser, saveGeneratedContent)
Router.route('/content/:id').delete(protectUser, deleteContent)

export default Router