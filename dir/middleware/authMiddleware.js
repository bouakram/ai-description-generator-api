"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const prismaClient_1 = require("../utils/prismaClient");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
require("colors");
const protectUser = (0, express_async_handler_1.default)(async (req, res, next) => {
    let token;
    let query;
    token = req.cookies.token;
    if (token) {
        try {
            const DECODED = jsonwebtoken_1.default.verify(token, process.env.TOKEN_KEY);
            DECODED.id.length === 21 ? query = { where: { googleId: DECODED.id }, select: { id: true, email: true } }
                : query = { where: { id: DECODED.id }, select: { id: true, email: true } };
            const USER = await prismaClient_1.prisma.user.findFirst(query);
            if (USER) {
                req.user = USER;
                next();
            }
            else {
                next(new ErrorHandler_1.default("not authenticated", 400));
            }
        }
        catch (error) {
            console.log(`${error}`.red);
            next(new ErrorHandler_1.default("not authorized", 401));
        }
    }
    else {
        next(new ErrorHandler_1.default("not authorized, no token", 401));
    }
});
exports.default = protectUser;
//# sourceMappingURL=authMiddleware.js.map