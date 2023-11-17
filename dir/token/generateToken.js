"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jwt = require('jsonwebtoken');
require('dotenv').config();
function generateToken({ res, id }) {
    const token = jwt.sign({ id }, process.env.TOKEN_KEY, {
        expiresIn: "15d"
    });
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000
    });
}
module.exports = generateToken;
//# sourceMappingURL=generateToken.js.map