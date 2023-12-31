import type { Response, Request, NextFunction } from "express"
import asyncHandler from 'express-async-handler'
import ErrHandeling from '../utils/ErrorHandler'
import { prisma } from '../utils/prismaClient'
import bcrypt from 'bcrypt'
import { config } from 'dotenv'
import generateToken from "../token/generateToken"
import { User } from "@prisma/client"
config()

//@desc google auth callback function
//@route GET auth/api/google/callback
//@access public
export const googleAuthCallback = (req: Request, res: Response) => {
    // Successful authentication, redirect home.)
    if (req.user) {
        const AUTHUSER = req.user as User
        res.cookie('token', generateToken(AUTHUSER.id), {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 15 * 24 * 60 * 60 * 1000
        })
    }
    res.redirect(process.env.FRONT_URL);
}

//@desc getting the user from req for the auth verification process
//@route GET api/v1/auth/verify-user
//@access public
export const verifyUser = (req: Request, res: Response) => {
    const token = req.cookies.token as string
    if (token) {
        return res.status(200).json({
            token: token
        })
    } else {
        return res.status(401).json({
            message: "no user found"
        })
    }
}

//@desc register user
//@route /api/v1/auth/register
//@access public
export const register = asyncHandler(async (req, res, next) => {
    const { email, username, password }: User = req.body
    if (!email || !username || !password) {
        return next(new ErrHandeling("enter all feald please", 400))
    }
    const USER = await prisma.user.findUnique({
        where: {
            email
        }
    })
    if (USER) {
        return next(new ErrHandeling("not allowed to register with this email, try another email please", 400))
    }
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    const CREATED_USER = await prisma.user.create({
        data: {
            email,
            username,
            password: hashedPassword,
        } as User
    })
    res.cookie('token', generateToken(CREATED_USER.id), {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development',
        sameSite: 'strict',
        maxAge: 15 * 24 * 60 * 60 * 1000
    })
    res.status(200).json({ message: 'User regestred successfully' })
})

//@desc login user
//@route /api/v1/auth/login
//@access public
export const logIn = asyncHandler(async (req, res, next) => {
    const { email, password }: User = req.body
    const USER = await prisma.user.findUnique({
        where: {
            email
        } as User
    })

    if (USER && await bcrypt.compare(password, USER.password)) {
        res.cookie('token', generateToken(USER.id), {
            httpOnly: true,
            secure: process.env.NODE_ENV !== 'development',
            sameSite: 'strict',
            maxAge: 15 * 24 * 60 * 60 * 1000
        })
        res.status(200).json({ message: "user logged in successfully", token: generateToken(USER.id) })
    } else {
        res.status(400).json({ message: "email or password is incorrect" })
    }
})

//@desc logout user
//@route /api/v1/auth/logout
//@access public
export const logOut = asyncHandler(async (req, res, next) => {
    res.clearCookie('token', {
        httpOnly: true,
        secure: process.env.NODE_ENV !== 'development'
    })

    req.logout({}, (err) => {
        if (err) {
            console.error(err);
            res.status(500).send('Internal Server Error');
        } else {
            res.status(203).redirect(process.env.FRONT_URL);
        }
    });
})