import jwt, { type JwtPayload } from 'jsonwebtoken'
import ErrHandeling from '../utils/ErrorHandler'
import { prisma } from '../utils/prismaClient'
import AsyncHandler from 'express-async-handler'
import { config } from 'dotenv'
import { NextFunction, Request, Response } from 'express'
import { User } from '@prisma/client'
config()
import('colors')

interface CostumeRequest extends Request {
    user?: Pick<User, "id" | "email">
}

const protectUser = AsyncHandler(async (req: CostumeRequest, res: Response, next: NextFunction) => {
    let token: string
    token = req.cookies.token
    if (token ?? false) {
        try {
            const DECODED = jwt.verify(token, process.env.TOKEN_KEY) as JwtPayload
            const USER: Pick<User, "id" | "email"> | null = await prisma.user.findUnique({
                where: {
                    id: DECODED.id
                },
                select: {
                    id: true,
                    email: true
                }
            })
            if (USER) {
                req.user = USER;
                next()
            } else {
                next(new ErrHandeling("not authenticated", 400))
            }
        } catch (error) {
            console.log(`${error}`.red)
            next(new ErrHandeling("not authorized", 401))
        }
    } else {
        next(new ErrHandeling("not authorized, no token", 401))
    }
})

export default protectUser