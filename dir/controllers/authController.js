"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logOut = exports.logIn = exports.register = exports.verifyUser = exports.googleAuthCallback = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const ErrorHandler_1 = __importDefault(require("../utils/ErrorHandler"));
const prismaClient_1 = require("../utils/prismaClient");
const bcrypt_1 = __importDefault(require("bcrypt"));
const dotenv_1 = require("dotenv");
const generateToken_1 = __importDefault(require("../token/generateToken"));
(0, dotenv_1.config)();
//@desc google auth callback function
//@route GET auth/api/google/callback
//@access public
const googleAuthCallback = (req, res) => {
    // Successful authentication, redirect home.)
    if (req.user) {
        const AUTHUSER = req.user;
        res.cookie('token', (0, generateToken_1.default)(AUTHUSER.id), {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 15 * 24 * 60 * 60 * 1000
        });
    }
    res.redirect(process.env.FRONT_URL);
};
exports.googleAuthCallback = googleAuthCallback;
//@desc getting the user from req for the auth verification process
//@route GET api/v1/auth/verify-user
//@access public
const verifyUser = (req, res) => {
    const token = req.cookies.token;
    if (token) {
        return res.status(200).json({
            token: token
        });
    }
    else {
        return res.status(401).json({
            message: "no user found"
        });
    }
};
exports.verifyUser = verifyUser;
//@desc register user
//@route /api/v1/auth/register
//@access public
exports.register = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email, username, password } = req.body;
    if (!email || !username || !password) {
        return next(new ErrorHandler_1.default("enter all feald please", 400));
    }
    const USER = await prismaClient_1.prisma.user.findUnique({
        where: {
            email
        }
    });
    if (USER) {
        return next(new ErrorHandler_1.default("not allowed to register with this email, try another email please", 400));
    }
    const salt = await bcrypt_1.default.genSalt(10);
    const hashedPassword = await bcrypt_1.default.hash(password, salt);
    const CREATED_USER = await prismaClient_1.prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
        }
    });
    res.cookie('token', (0, generateToken_1.default)(CREATED_USER.id), {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000
    });
    res.status(200).json({ message: 'User regestred successfully' });
});
//@desc login user
//@route /api/v1/auth/login
//@access public
exports.logIn = (0, express_async_handler_1.default)(async (req, res, next) => {
    const { email, password } = req.body;
    const USER = await prismaClient_1.prisma.user.findUnique({
        where: {
            email
        }
    });
    if (USER && await bcrypt_1.default.compare(password, USER.password)) {
        res.cookie('token', (0, generateToken_1.default)(USER.id), {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 15 * 24 * 60 * 60 * 1000
        });
        res.status(200).json({ message: "user logged in successfully", token: (0, generateToken_1.default)(USER.id) });
    }
    else {
        res.status(400).json({ message: "email or password is incorrect" });
    }
});
//@desc logout user
//@route /api/v1/auth/logout
//@access public
exports.logOut = (0, express_async_handler_1.default)(async (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: true
    });
    req.logout({}, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        }
        else {
            res.status(203).redirect(process.env.FRONT_URL);
        }
    });
});
//# sourceMappingURL=authController.js.map