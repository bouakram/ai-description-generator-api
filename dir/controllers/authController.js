"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const asyncHandler = require('express-async-handler');
const ErrHandeling = require('../utils/ErrorHandler');
const prisma = require('../utils/prismaClient');
//@desc login user
//@route /api/v1/auth/login
//@access public
asyncHandler(async function logIn(req, res, next) {
});
//@desc login user
//@route /api/v1/auth/signin
//@access public
asyncHandler(async function signIn(req, res, next) {
});
//@desc login user
//@route /api/v1/auth/logout
//@access public
asyncHandler(async function logOut(req, res, next) {
});
//# sourceMappingURL=authController.js.map