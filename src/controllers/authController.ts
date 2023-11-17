import type { Response, Request, NextFunction } from "express"

const asyncHandler = require('express-async-handler')
const ErrHandeling = require('../utils/ErrorHandler')
const prisma = require('../utils/prismaClient')

//@desc login user
//@route /api/v1/auth/login
//@access public
asyncHandler(async function logIn(req: Response, res: Response, next: NextFunction) {

})
//@desc login user
//@route /api/v1/auth/signin
//@access public
asyncHandler(async function signIn(req: Request, res: Response, next: NextFunction) {

})
//@desc login user
//@route /api/v1/auth/logout
//@access public
asyncHandler(async function logOut(req: Request, res: Response, next: NextFunction) {

})