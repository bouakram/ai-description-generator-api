import express from 'express'
import cors from 'cors'
import logger from 'morgan'
import ErrHandeling from './utils/ErrorHandler'
import globalError from './middleware/errorMiddleware'

import { config } from 'dotenv'
config()
import('colors')

//export routes
import DescGen from './routes/openaiRoutes'
import cookieParser from 'cookie-parser'

const app = express()
const port = process.env.PORT || 5001

//middlewares
app.use(cors({
    origin: process.env.FRONT_URL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

//routes
app.use("/api/v1/auth")
app.use("/api/v1/openai", DescGen)

//handling invalid routes
app.all("*", (req, res, next) => {
    next(new ErrHandeling(`no route found ${req.originalUrl}`, 400))
})


// error middleware
app.use(globalError)

//logger
if (process.env.NODE_ENV !== 'development') {
    app.use(logger("dev"))
    console.log(`MODE : ${process.env.NODE_ENV}`.blue.italic)
}

//starting the server
const server = app.listen(port, () => {
    console.log(`server listening on port ${port}`.white.bgMagenta.italic)
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