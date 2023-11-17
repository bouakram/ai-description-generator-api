"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
const OpenAI = require('openai');
const openai = new OpenAI({ apiKey: process.env.API_KEY });
exports.default = openai;
//# sourceMappingURL=openaiConfig.js.map