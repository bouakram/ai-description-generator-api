"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
function generateToken(id) {
    const token = jsonwebtoken_1.default.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: "15d"
    });
    return token;
}
exports.default = generateToken;
//# sourceMappingURL=generateToken.js.map