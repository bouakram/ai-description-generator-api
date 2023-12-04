import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import ErrHandeling from './utils/ErrorHandler'
import globalError from './middleware/errorMiddleware'
import cookieParser from 'cookie-parser'
import session from "express-session"

import { config } from 'dotenv'
config()
import 'colors'

//export routes
import DescGen from './routes/openaiRoutes'
import Auth from './routes/authRoutes'
import passport from 'passport'


const app = express()
const port = process.env.PORT || 5001

//middlewares
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    origin: process.env.FRONT_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true,
}))
app.use(session({
    secret: 'secret',
    resave: false,
    unset: 'destroy',
}))
app.use(cookieParser())
app.use(passport.initialize())

//routes
app.use("/api/v1/auth", Auth)
app.use("/api/v1/openai", DescGen)
// TODO: adding new routes platform
// app.use("/api/v1/platform", Platform)
// TODO: adding new routes Topic
// app.use("/api/v1/topic", Topic)

//handling invalid routes
app.all("*", (req, res, next) => {
    next(new ErrHandeling(`no route found ${req.originalUrl}`, 400))
})


// error middleware
app.use(globalError)

//logger
if (process.env.NODE_ENV === 'development') {
    app.use(logger("dev"))
    console.log(`MODE : ${process.env.NODE_ENV}`.bgBlue)
}

//starting the server
const server = app.listen(port, () => {
    console.log(`server listening on port ${port}`.bgMagenta.white)
})

//@desc global err handeling rejection outside express
process.on("unhandledRejection", (err: unknown) => {
    if (err instanceof ErrHandeling) {
        console.error(`unhandledRejection Errors : ${err.name} | ${err.message}`)
        // close the server and kill the application
        server.close(() => {
            console.error("shuting down ...")
            process.exit(1)
        })
    } else {
        console.error(`unhandledRejection Errors : ${err}`)
        // close the server and kill the application
        server.close(() => {
            console.error("shuting down ...")
            process.exit(1)
        })
    }
})