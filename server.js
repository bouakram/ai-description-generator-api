const express = require('express')
const cors = require('cors')
const logger = require('logger')
const ErrHandeling = require('./utils/ErrorHandler')
const globalError = require('./middleware/errorMiddleware')

require('dotenv').config()
require('colors')

//export routes
const DescGen = require('./routes/openaiRoutes')

const app = express()
const port = process.env.PORT || 5001

//middlewares
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

//routes
app.use("/api/v1/openai", DescGen)

//handling invalid routes
app.all("*", (req, res, next)=>{
    next(new ErrHandeling(`no route found ${req.originalUrl}`, 400))
})


// error middleware
app.use(globalError)

//logger
if(process.env.NODE_ENV !== 'development'){
    app.use(logger("dev"))
    console.log(`MODE : ${process.env.NODE_ENV}`.blue.italic)
}

//starting the server
const server = app.listen(port, ()=>{
    console.log(`server listening on port ${port}` .white.bgMagenta.italic)
})

//@desc global err handeling rejection outside express
process.on("unhandledRejection", (err) => {
    console.error(`unhandledRejection Errors : ${err.name} | ${err.message}`)
    // close the server and kill the application
    server.close(() => {
        console.error("shuting down ...")
        process.exit(1)
    })
})