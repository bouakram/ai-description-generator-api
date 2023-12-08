import jwt, { type JwtPayload } from 'jsonwebtoken'
import ErrHandeling from '../utils/ErrorHandler'
import { prisma } from '../utils/prismaClient'
import AsyncHandler from 'express-async-handler'
import { User } from '@prisma/client'
import { config } from 'dotenv'
config()
import 'colors'

const protectUser = AsyncHandler(async (req, res, next) => {
    let token: string
    let query: object
    token = req.cookies.token
    if (token) {
        try {
            const DECODED = jwt.verify(token, process.env.TOKEN_KEY) as JwtPayload
            DECODED.id.length === 21 ? query = { where: { googleId: DECODED.id }, select: { id: true, email: true } }
                : query = { where: { id: DECODED.id }, select: { id: true, email: true } }
            const USER: Pick<User, "id" | "email"> = await prisma.user.findFirst(query)
            if (USER) {
                req.user = USER
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